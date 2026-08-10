#!/usr/bin/env python3
"""Build a concise first-round BESS investment discussion guide from JSON."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

CONTENT_WIDTH_DXA = 9360
TABLE_INDENT_DXA = 120
FONT = "Calibri"
NAVY = "0B2545"
BLUE = "2E74B5"
DARK_BLUE = "1F4D78"
MUTED = "5F6B76"
LIGHT_GRAY = "F2F4F7"
BLUE_GRAY = "E8EEF5"
BORDER = "C9D1D9"
WHITE = "FFFFFF"


def set_run_font(run, size: float, color: str = NAVY, bold: bool = False, italic: bool = False) -> None:
    run.font.name = FONT
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), FONT)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), FONT)
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)
    run.bold = bold
    run.italic = italic


def set_repeat_table_header(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    header = OxmlElement("w:tblHeader")
    header.set(qn("w:val"), "true")
    tr_pr.append(header)


def prevent_row_split(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    cant_split = OxmlElement("w:cantSplit")
    tr_pr.append(cant_split)


def set_cell_shading(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top: int = 80, start: int = 120, bottom: int = 80, end: int = 120) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for edge, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{edge}"))
        if node is None:
            node = OxmlElement(f"w:{edge}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_cell_width(cell, width_dxa: int) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_w = tc_pr.find(qn("w:tcW"))
    if tc_w is None:
        tc_w = OxmlElement("w:tcW")
        tc_pr.append(tc_w)
    tc_w.set(qn("w:w"), str(width_dxa))
    tc_w.set(qn("w:type"), "dxa")


def set_table_borders(table, color: str = BORDER, size: int = 4) -> None:
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.find(qn("w:tblBorders"))
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = borders.find(qn(f"w:{edge}"))
        if tag is None:
            tag = OxmlElement(f"w:{edge}")
            borders.append(tag)
        tag.set(qn("w:val"), "single")
        tag.set(qn("w:sz"), str(size))
        tag.set(qn("w:space"), "0")
        tag.set(qn("w:color"), color)


def set_table_geometry(table, widths_dxa: list[int]) -> None:
    if sum(widths_dxa) != CONTENT_WIDTH_DXA:
        raise ValueError(f"Table widths must total {CONTENT_WIDTH_DXA} DXA")
    table.autofit = False
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl_pr = table._tbl.tblPr

    layout = tbl_pr.find(qn("w:tblLayout"))
    if layout is None:
        layout = OxmlElement("w:tblLayout")
        tbl_pr.append(layout)
    layout.set(qn("w:type"), "fixed")

    tbl_w = tbl_pr.find(qn("w:tblW"))
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(CONTENT_WIDTH_DXA))
    tbl_w.set(qn("w:type"), "dxa")

    tbl_ind = tbl_pr.find(qn("w:tblInd"))
    if tbl_ind is None:
        tbl_ind = OxmlElement("w:tblInd")
        tbl_pr.append(tbl_ind)
    tbl_ind.set(qn("w:w"), str(TABLE_INDENT_DXA))
    tbl_ind.set(qn("w:type"), "dxa")

    grid = table._tbl.tblGrid
    for child in list(grid):
        grid.remove(child)
    for width in widths_dxa:
        col = OxmlElement("w:gridCol")
        col.set(qn("w:w"), str(width))
        grid.append(col)

    for row in table.rows:
        for cell, width in zip(row.cells, widths_dxa):
            set_cell_width(cell, width)
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER


def set_paragraph_spacing(paragraph, before: float = 0, after: float = 0, line: float = 1.0) -> None:
    pf = paragraph.paragraph_format
    pf.space_before = Pt(before)
    pf.space_after = Pt(after)
    pf.line_spacing = line


def add_field(paragraph, instruction: str) -> None:
    run = paragraph.add_run()
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = instruction
    separate = OxmlElement("w:fldChar")
    separate.set(qn("w:fldCharType"), "separate")
    text = OxmlElement("w:t")
    text.text = "1"
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    run._r.extend([begin, instr, separate, text, end])
    set_run_font(run, 8.5, MUTED)


def configure_styles(doc: Document) -> None:
    normal = doc.styles["Normal"]
    normal.font.name = FONT
    normal._element.rPr.rFonts.set(qn("w:ascii"), FONT)
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
    normal.font.size = Pt(11)
    normal.font.color.rgb = RGBColor.from_string(NAVY)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.10

    title = doc.styles["Title"]
    title.font.name = FONT
    title._element.rPr.rFonts.set(qn("w:ascii"), FONT)
    title._element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
    title.font.size = Pt(23)
    title.font.bold = True
    title.font.color.rgb = RGBColor.from_string(NAVY)
    title.paragraph_format.space_before = Pt(0)
    title.paragraph_format.space_after = Pt(4)

    heading = doc.styles["Heading 1"]
    heading.font.name = FONT
    heading._element.rPr.rFonts.set(qn("w:ascii"), FONT)
    heading._element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
    heading.font.size = Pt(16)
    heading.font.bold = True
    heading.font.color.rgb = RGBColor.from_string(BLUE)
    heading.paragraph_format.space_before = Pt(14)
    heading.paragraph_format.space_after = Pt(8)
    heading.paragraph_format.keep_with_next = True


def configure_section(doc: Document, data: dict[str, Any]) -> None:
    section = doc.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)
    section.header_distance = Inches(0.492)
    section.footer_distance = Inches(0.492)

    header_p = section.header.paragraphs[0]
    header_p.text = ""
    header_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    header_run = header_p.add_run(f"{data['project_title']} | Investor Discussion")
    set_run_font(header_run, 8.5, MUTED)
    set_paragraph_spacing(header_p, after=0)

    footer_p = section.footer.paragraphs[0]
    footer_p.text = ""
    footer_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = footer_p.add_run(f"{data.get('confidentiality', 'Confidential')} | Page ")
    set_run_font(run, 8.5, MUTED)
    add_field(footer_p, "PAGE")
    run = footer_p.add_run(" of ")
    set_run_font(run, 8.5, MUTED)
    add_field(footer_p, "NUMPAGES")
    set_paragraph_spacing(footer_p, after=0)


def add_metadata_line(doc: Document, label: str, value: str) -> None:
    p = doc.add_paragraph()
    set_paragraph_spacing(p, after=2, line=1.05)
    r = p.add_run(f"{label}: ")
    set_run_font(r, 10.5, NAVY, bold=True)
    r = p.add_run(value)
    set_run_font(r, 10.5, NAVY)


def add_question_table(doc: Document, questions: list[dict[str, str]]) -> None:
    widths = [620, 2040, 6700]
    table = doc.add_table(rows=1, cols=3)
    set_table_geometry(table, widths)
    set_table_borders(table)

    headers = ("No.", "Investment theme", "Strategic question")
    header_row = table.rows[0]
    set_repeat_table_header(header_row)
    prevent_row_split(header_row)
    for idx, text in enumerate(headers):
        cell = header_row.cells[idx]
        set_cell_shading(cell, NAVY)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
        set_paragraph_spacing(p, after=0, line=1.0)
        r = p.add_run(text)
        set_run_font(r, 9.4, WHITE, bold=True)

    for question in questions:
        row = table.add_row()
        prevent_row_split(row)
        id_cell, theme_cell, question_cell = row.cells
        set_cell_shading(id_cell, BLUE_GRAY)
        set_cell_shading(theme_cell, LIGHT_GRAY)

        p = id_cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_paragraph_spacing(p, after=0, line=1.0)
        r = p.add_run(question["id"])
        set_run_font(r, 10.2, DARK_BLUE, bold=True)

        p = theme_cell.paragraphs[0]
        set_paragraph_spacing(p, after=0, line=1.05)
        r = p.add_run(question["theme"])
        set_run_font(r, 9.8, DARK_BLUE, bold=True)

        p = question_cell.paragraphs[0]
        set_paragraph_spacing(p, after=0, line=1.08)
        r = p.add_run(question["question"])
        set_run_font(r, 10.0, NAVY)

        for cell, width in zip(row.cells, widths):
            set_cell_width(cell, width)
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER


def validate_data(data: dict[str, Any]) -> None:
    required = ("project_title", "document_title", "review_date", "source_materials", "purpose", "discussion_note", "questions")
    missing = [key for key in required if not data.get(key)]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

    legacy = {"response_protocol", "priority_definitions", "sections"}.intersection(data)
    if legacy:
        raise ValueError(f"First-round format does not allow legacy fields: {', '.join(sorted(legacy))}")

    questions = data["questions"]
    if not isinstance(questions, list) or not 6 <= len(questions) <= 10:
        raise ValueError("First-round question list must contain 6 to 10 questions")

    seen: set[str] = set()
    forbidden_phrases = (
        "please provide", "provide the", "please confirm", "confirm the", "please verify",
        "verify the", "substantiate", "attach", "what evidence", "which documents",
        "evidence requested", "data room", "vdr",
    )
    for question in questions:
        if "evidence" in question or "priority" in question:
            raise ValueError(f"First-round question {question.get('id', '?')} must not request evidence or use priority")
        for key in ("id", "theme", "question"):
            if not question.get(key):
                raise ValueError(f"Question is missing {key}: {question}")
        if question["id"] in seen:
            raise ValueError(f"Duplicate question id: {question['id']}")
        seen.add(question["id"])
        lowered = question["question"].lower()
        hit = next((phrase for phrase in forbidden_phrases if phrase in lowered), None)
        if hit:
            raise ValueError(f"Question {question['id']} uses deferred-diligence language: {hit}")

    first_theme = questions[0]["theme"].lower()
    second_theme = questions[1]["theme"].lower()
    if "market" not in first_theme:
        raise ValueError("The first question must address the market thesis")
    if not any(term in second_theme for term in ("region", "area", "location", "zone")):
        raise ValueError("The second question must address the regional or area thesis")


def build_document(data: dict[str, Any], output_path: Path) -> None:
    validate_data(data)
    doc = Document()
    configure_styles(doc)
    configure_section(doc, data)

    doc.core_properties.title = f"{data['project_title']} - {data['document_title']}"
    doc.core_properties.subject = data["purpose"]
    doc.core_properties.author = "Equity Investor"
    doc.core_properties.keywords = "BESS, equity investment, market thesis, first-round discussion"

    title = doc.add_paragraph(style="Title")
    title.add_run(data["document_title"])
    subtitle = doc.add_paragraph()
    set_paragraph_spacing(subtitle, after=12)
    r = subtitle.add_run(data["project_title"])
    set_run_font(r, 14, DARK_BLUE, bold=True)

    add_metadata_line(doc, "Review date", data["review_date"])
    add_metadata_line(doc, "Purpose", data["purpose"])
    add_metadata_line(doc, "Status", data.get("confidentiality", "Confidential - diligence use only"))

    intro = doc.add_paragraph()
    set_paragraph_spacing(intro, before=10, after=8, line=1.10)
    r = intro.add_run("First-round focus. ")
    set_run_font(r, 10.5, NAVY, bold=True)
    r = intro.add_run(data["discussion_note"])
    set_run_font(r, 10.5, NAVY)

    heading = doc.add_paragraph("Strategic investment questions", style="Heading 1")
    heading.paragraph_format.keep_with_next = True
    add_question_table(doc, data["questions"])

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(output_path)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-json", required=True, type=Path)
    parser.add_argument("--output-docx", required=True, type=Path)
    args = parser.parse_args()

    with args.input_json.open("r", encoding="utf-8-sig") as handle:
        data = json.load(handle)
    build_document(data, args.output_docx)
    print(f"Created {args.output_docx}")


if __name__ == "__main__":
    main()
