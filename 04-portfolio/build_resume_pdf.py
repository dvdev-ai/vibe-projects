#!/usr/bin/env python3
"""Резюме Данилы Вертия: макет как у выгрузки Хабр Карьеры (kolloko2). 2 листа A4."""

from pathlib import Path
from shutil import copy2

from PIL import Image
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent
FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_B = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

pdfmetrics.registerFont(TTFont("A", FONT))
pdfmetrics.registerFont(TTFont("AB", FONT_B))

W, H = A4
ML = 34
MR = 32
DATE_W = 112
GAP = 16
PHOTO_W = 92
PHOTO_H = 118
INK = HexColor("#111111")
MUTED = HexColor("#6B6B6B")
LINE = HexColor("#C8C8C8")
PHOTO_BG = HexColor("#F2F2F2")
PAPER = white
BOTTOM = 36
PHOTO_SRC = ROOT / "assets" / "resume-photo.png"


def wrap(c, text, font, size, max_w):
    words = text.split()
    lines, cur = [], ""
    for word in words:
        trial = (cur + " " + word).strip()
        if c.stringWidth(trial, font, size) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines or [""]


def draw_lines(c, lines, x, y, font, size, leading, color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    for line in lines:
        if y < BOTTOM:
            return y
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_wrapped(c, text, x, y, font, size, max_w, leading, color=INK):
    return draw_lines(c, wrap(c, text, font, size, max_w), x, y, font, size, leading, color)


def page_bg(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def hrule(c, y):
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(ML, y, W - MR, y)


def section_title(c, text, y):
    hrule(c, y)
    y -= 15
    c.setFillColor(INK)
    c.setFont("AB", 12.5)
    c.drawString(ML, y, text)
    return y - 16


def labeled(c, label, value, x, y, max_w, value_color=INK):
    c.setFont("A", 9)
    c.setFillColor(MUTED)
    prefix = f"{label} "
    c.drawString(x, y, prefix)
    left = x + c.stringWidth(prefix, "A", 9)
    return draw_wrapped(c, value, left, y, "A", 9, max_w - (left - x), 12, value_color) - 1


def photo_reader():
    im = Image.open(PHOTO_SRC).convert("RGB")
    target = PHOTO_W / PHOTO_H
    w, h = im.size
    if w / h > target:
        nw = int(h * target)
        left = (w - nw) // 2
        im = im.crop((left, 0, left + nw, h))
    else:
        nh = int(w / target)
        top = max(0, (h - nh) // 5)
        im = im.crop((0, top, w, min(h, top + nh)))
    return ImageReader(im)


def photo_slot(c):
    px = W - MR - PHOTO_W
    py = H - 28 - PHOTO_H
    c.saveState()
    path = c.beginPath()
    path.rect(px, py, PHOTO_W, PHOTO_H)
    c.clipPath(path, stroke=0)
    c.drawImage(photo_reader(), px, py, width=PHOTO_W, height=PHOTO_H, mask="auto")
    c.restoreState()
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.rect(px, py, PHOTO_W, PHOTO_H, fill=0, stroke=1)
    return px


def header(c, tagline):
    page_bg(c)
    photo_slot(c)
    text_w = W - ML - MR - PHOTO_W - 16
    y = H - 40
    c.setFillColor(INK)
    c.setFont("AB", 20)
    c.drawString(ML, y, "Данила Вертий")
    y -= 18
    y = draw_wrapped(c, tagline, ML, y, "A", 10.5, text_w, 14, MUTED)
    y -= 10

    c.setFillColor(INK)
    c.setFont("AB", 10)
    c.drawString(ML, y, "Местоположение")
    y -= 13
    y = labeled(c, "Проживание:", "Россия, Самара", ML, y, text_w)
    y = labeled(c, "Готовность к работе:", "готов к удаленной работе", ML, y, text_w)
    y -= 6

    c.setFillColor(INK)
    c.setFont("AB", 10)
    c.drawString(ML, y, "Стаж и ожидания")
    y -= 13
    y = labeled(c, "Стаж:", "7 месяцев в ИИ и продуктовой сборке", ML, y, text_w)
    y = labeled(c, "Зарплатные ожидания:", "От 50 000 руб.", ML, y, text_w)
    y -= 6

    c.setFillColor(INK)
    c.setFont("AB", 10)
    c.drawString(ML, y, "Контактная информация")
    y -= 13
    y = labeled(c, "Моб.:", "+7 (937) 994-66-16", ML, y, text_w)
    y = labeled(c, "Телеграм:", "@danyavertiy", ML, y, text_w)
    y = labeled(c, "Email:", "vertiydanila@mail.ru", ML, y, text_w)
    photo_bottom = H - 28 - PHOTO_H
    return min(y, photo_bottom) - 12


def skills_line(c, y):
    y = section_title(c, "Профессиональные навыки", y)
    text = (
        "Python • React • TypeScript • FastAPI • Vite • Docker • SQLite • PostgreSQL • "
        "LLM • Telegram Bot API • Plane • Forgejo • GitHub • "
        "Excel • Cursor • воронки продаж • оформление документов • справки • договоры"
    )
    return draw_wrapped(c, text, ML, y, "A", 9.5, W - ML - MR, 13) - 6


def timeline_dates(c, lines, y):
    return draw_lines(c, lines, ML, y, "A", 9, 12, MUTED)


def job_block(c, dates, company, role, duties, skills, y, max_w_right):
    x = ML + DATE_W + GAP
    date_y = timeline_dates(c, dates, y)
    c.setFillColor(INK)
    c.setFont("AB", 11.5)
    c.drawString(x, y, company)
    y -= 13
    if role:
        y = draw_wrapped(c, role, x, y, "A", 9.5, max_w_right, 12, MUTED) - 4
    c.setFillColor(INK)
    c.setFont("AB", 9.5)
    c.drawString(x, y, "Обязанности и достижения")
    y -= 12
    y = draw_wrapped(c, duties, x, y, "A", 9.5, max_w_right, 12.5) - 4
    c.setFillColor(INK)
    c.setFont("AB", 9.5)
    c.drawString(x, y, "Применяемые навыки")
    y -= 12
    y = draw_wrapped(c, skills, x, y, "A", 9.5, max_w_right, 12.5)
    return min(date_y, y) - 12


def project_block(c, dates, title, role, body, skills, y, max_w_right):
    x = ML + DATE_W + GAP
    date_y = timeline_dates(c, dates, y)
    c.setFillColor(INK)
    c.setFont("AB", 11.5)
    c.drawString(x, y, title)
    y -= 13
    y = draw_wrapped(c, role, x, y, "A", 9.5, max_w_right, 12, MUTED) - 4
    y = draw_wrapped(c, body, x, y, "A", 9.5, max_w_right, 12.5) - 4
    c.setFillColor(INK)
    c.setFont("AB", 9.5)
    c.drawString(x, y, "Применяемые навыки")
    y -= 12
    y = draw_wrapped(c, skills, x, y, "A", 9.5, max_w_right, 12.5)
    return min(date_y, y) - 12


def about_block(c, y, max_w):
    y = section_title(c, "О себе", y)
    paras = [
        "Студент направления «Механика и математическое моделирование». Рассматриваю стажировки и junior-позиции в сборке ИИ-продуктов: боты, сайты, кабинеты, автоматизация, работа с LLM.",
        "С февраля 2026 работаю в агентстве QLAN — ИИ-продукты в команде. Ставлю задачи в Plane, веду репозитории в Forgejo и точечно в GitHub, через OpenClaw собирал контекстных помощников. Собираю лендинги, боты, кабинеты и автоматизацию на Python, React, LLM API. Оформляю таблицы, справки и договоры. Общаюсь с поставщиками и заказчиками, предлагаю решения, работаю с воронками продаж и подрядчиками по рекламе. За 7 месяцев закрыл 4 проекта до рабочей версии. Названия клиентов не указываю — проекты под NDA.",
        "Есть свой продукт: VOID Connect — коммерческий VPN-сервис в сети с 26 июня 2026. Сайт, кабинет, Telegram-бот, оплата и инфраструктура в одном контуре. voidconnect.tech. Агора — личный ИИ-ассистент в Telegram на 10 рабочих команд, пользуюсь каждый день.",
        "Во время обучения в Contented создавал собственные дизайн-проекты: планировки, визуализации, интерьеры. Для Самарского регионального отделения Поискового движения России собрал концепцию музея, брошюру и опись.",
        "В университете участвовал в конференциях по механике и математическому моделированию, предлагал внедрение ИИ в расчеты и модели. Сейчас собираю пайплайн для факультета: общая оболочка под ATOMSK, LAMMPS и OVITO.",
        "Техническая база: Python, FastAPI, React, TypeScript, Vite, Docker, SQLite, PostgreSQL, Telegram Bot API, LLM, Plane, Forgejo, GitHub, Excel, Cursor. Английский B2. Хорошо работаю с документацией, большим объемом информации и доведением задачи до рабочего результата. Готов быстро учиться, брать практические задачи и закрывать контур целиком.",
    ]
    for para in paras:
        y = draw_wrapped(c, para, ML, y, "A", 9.5, max_w, 12.5) - 7
    return y


def build(out: Path, tagline: str):
    c = canvas.Canvas(str(out), pagesize=A4)
    c.setTitle("Данила Вертий — резюме")
    c.setAuthor("Данила Вертий")
    max_w = W - ML - MR
    right_w = W - MR - (ML + DATE_W + GAP)

    y = header(c, tagline)
    y = skills_line(c, y)

    y = section_title(c, "Опыт работы", y)
    y = job_block(
        c,
        ["Февраль 2026 —", "По наст. время", "(7 месяцев)"],
        "QLAN",
        "ИИ-продукты • в команде",
        "Ставлю задачи в Plane, связываю их с репозиторием и корпоративной почтой. Веду репозитории в Forgejo, точечно в GitHub. Через OpenClaw собирал контекстных помощников. Собираю лендинги, боты, кабинеты и автоматизацию на Python, React, LLM API. Оформляю таблицы, документацию, справки и договоры. Общался с поставщиками и заказчиками, предлагал и внедрял решения. Обсуждал и формировал воронки продаж. Работал с подрядчиками по рекламе и продвижению продуктов. За 7 месяцев закрыл 4 проекта до рабочей версии. Названия клиентов не указываю — проекты под NDA.",
        "Python • React • TypeScript • FastAPI • Vite • Docker • SQLite • PostgreSQL • LLM • Telegram Bot API • Plane • Forgejo • GitHub • Excel • Cursor • воронки продаж • оформление документов • справки • договоры",
        y,
        right_w,
    )
    y = job_block(
        c,
        ["Ноябрь 2025 —", "Март 2026", "(5 месяцев)"],
        "СамРО ПДР",
        "Брошюра и концепция музея",
        "Для Самарского регионального отделения Поискового движения России собрал концепцию развития музея и упаковал визуал: брошюра, опись, материалы для показа.",
        "Визуал, документация",
        y,
        right_w,
    )
    y = job_block(
        c,
        ["Февраль 2024 —", "Сентябрь 2025", "(1 год 8 месяцев)"],
        "Contented",
        "Собственные дизайн-проекты во время обучения",
        "Во время обучения в Contented создавал собственные дизайн-проекты: планировки, визуализации, интерьерные решения.",
        "Визуал, планировки, интерьеры",
        y,
        right_w,
    )

    y = section_title(c, "Высшее образование", y)
    date_y = timeline_dates(c, ["Сентябрь 2023 —", "2027"], y)
    x = ML + DATE_W + GAP
    c.setFillColor(INK)
    c.setFont("AB", 11.5)
    c.drawString(x, y, "Самарский университет им. Королева")
    y -= 13
    y = draw_wrapped(
        c,
        "01.03.03 Механика и математическое моделирование • очная форма",
        x,
        y,
        "A",
        9.5,
        right_w,
        12,
    )
    y = min(date_y, y)

    c.showPage()
    page_bg(c)
    y = H - 40
    y = about_block(c, y, max_w) - 4

    y = section_title(c, "Проекты", y)
    y = project_block(
        c,
        ["Июнь 2026 —", "По наст. время"],
        "VOID Connect",
        "Свой VPN-сервис • самый крупный контур",
        "Собрал коммерческий VPN-сервис и довел до запуска: витрина, кабинет, Telegram-бот, оплата, инфраструктура. SQLite — основная база, PostgreSQL — путь миграции. https://voidconnect.tech · https://t.me/VoidConnectBot",
        "Python, FastAPI, React, TypeScript, Vite, Docker, SQLite, PostgreSQL, Platega, Telegram Bot API",
        y,
        right_w,
    )
    y = project_block(
        c,
        ["Личный проект"],
        "Агора",
        "ИИ-ассистент в Telegram",
        "Собрал личного ИИ-ассистента в Telegram, не шаблонный чат. 10 рабочих команд: чек-ап, сводка, напоминания, голос, разбор идеи и вакансии. Память диалога, выгрузка данных, запуск на VPS. https://t.me/agora_mind_bot",
        "Python, LLM API, Telegram Bot API, VPS",
        y,
        right_w,
    )
    y = project_block(
        c,
        ["Экспериментальный"],
        "Контекстный ассистент",
        "OpenClaw / ZeroClaw",
        "Собрал ассистента, который держит контекст задачи между шагами. Связал OpenClaw и ZeroClaw и проверил цикл: запрос → контекст → ответ → правка. Ссылка: показать по запросу.",
        "OpenClaw, ZeroClaw, LLM",
        y,
        right_w,
    )
    y = project_block(
        c,
        ["Прикладные сборки"],
        "Парсинг документов и вебинар",
        "Разбор документов и программа эфира",
        "Собрал разбор документов, в том числе под юридический документооборот: даты, суммы, контакты, стороны — в таблицу и CSV. Подготовил программу вебинара по нейросетям на 90 минут. Ссылка: показать по запросу.",
        "Python, LLM, Excel, CSV",
        y,
        right_w,
    )
    c.save()
    print(out)


def main():
    agency = ROOT / "Данила_Вертий_резюме_agency.pdf"
    corporate = ROOT / "Данила_Вертий_резюме_corporate.pdf"
    default = ROOT / "Данила_Вертий_резюме.pdf"
    build(
        agency,
        "AI Product Builder. Собираю ИИ-продукты от интерфейса до запуска: бот, сайт, кабинет.",
    )
    build(
        corporate,
        "AI Product Builder · end-to-end · LLM. ИИ-продукты в агентстве QLAN.",
    )
    default.write_bytes(corporate.read_bytes())
    print(default)
    downloads = Path.home() / "Downloads"
    for src in (agency, corporate, default):
        dest = downloads / src.name
        copy2(src, dest)
        print(dest)


if __name__ == "__main__":
    main()
