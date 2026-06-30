import pdfplumber, sys, json

pdf_path = sys.argv[1] if len(sys.argv) > 1 else '新产品经营分析看板.pdf'
out_path = sys.argv[2] if len(sys.argv) > 2 else '新产品经营分析看板.txt'

with pdfplumber.open(pdf_path) as pdf:
    text = ''
    for i, page in enumerate(pdf.pages):
        page_text = page.extract_text() or ''
        text += f'\n--- Page {i+1} ---\n' + page_text

open(out_path, 'w', encoding='utf-8').write(text)
print('extracted', len(text), 'chars to', out_path)
