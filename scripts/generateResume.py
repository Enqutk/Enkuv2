#!/usr/bin/env python3
"""Write a one-page Helvetica PDF resume without third-party libraries."""
from pathlib import Path

OUT = Path("/home/kimem/Documents/portfolio/Enkuv2/Enku_Tadesse_resume.pdf")
W, H = 612, 792
MARGIN = 48

ops = []


def esc(text):
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def fill(r, g, b):
    ops.append(f"{r:.3f} {g:.3f} {b:.3f} rg")


def stroke(r, g, b):
    ops.append(f"{r:.3f} {g:.3f} {b:.3f} RG")


def rect(x, y, w, h):
    ops.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re f")


def txt(x, y, size, s, font="F1"):
    ops.append(f"BT /{font} {size} Tf {x:.2f} {y:.2f} Td ({esc(s)}) Tj ET")


def rule(y):
    stroke(0.72, 0.53, 0.04)
    ops.append("0.7 w")
    ops.append(f"{MARGIN} {y:.2f} m {W - MARGIN} {y:.2f} l S")


y = 0  # unused, we set coordinates explicitly

# Header
fill(0.04, 0.04, 0.06)
rect(0, 700, W, 92)
fill(0.72, 0.53, 0.04)
rect(0, 696, W, 4)
fill(1, 1, 1)
txt(MARGIN, 754, 22, "ENKU TADESSE", "F2")
fill(0.85, 0.85, 0.85)
txt(MARGIN, 734, 9, "Full Stack Developer  |  Intern, Teter Trending PLC")
fill(0.45, 0.45, 0.45)
txt(MARGIN, 676, 8.5, "Addis Ababa, Ethiopia  |  +251 931 727 965  |  enkukokob@gmail.com")
txt(MARGIN, 664, 8.5, "enkuv2.vercel.app  |  github.com/Enqutk")

y = 640


def heading(title):
    global y
    fill(0.72, 0.53, 0.04)
    txt(MARGIN, y, 10, title.upper(), "F2")
    y -= 8
    rule(y)
    y -= 16
    fill(0.08, 0.08, 0.08)


def line(s, size=9.5, font="F1", gap=13):
    global y
    txt(MARGIN, y, size, s, font)
    y -= gap


def bullet(s):
    global y
    txt(MARGIN + 10, y, 9.5, "-  " + s)
    y -= 13


heading("Objective")
line("Aspiring full stack developer focused on shipping useful products, leading client")
line("delivery, and building clean, practical web tools.")
y -= 6

heading("Experience")
line("Software Intern  |  Teter Trending PLC", 10.5, "F2", 13)
fill(0.4, 0.4, 0.4)
line("2026 - Present", 8.5, "F1", 13)
fill(0.08, 0.08, 0.08)
bullet("Contributed to production repositories at Gasha Digital, Abel, and Teter Trending.")
bullet("Shipped full-stack intern work across those codebases with the engineering team.")
bullet("Supported live client products and day-to-day delivery.")
y -= 4
line("Project Manager  |  Akilil Digital Realm Website", 10.5, "F2", 13)
fill(0.4, 0.4, 0.4)
line("2026  |  Teter Trending PLC internship", 8.5, "F1", 13)
fill(0.08, 0.08, 0.08)
bullet("Led the website as project manager from kickoff through delivery.")
bullet("Direct client contact for requirements, updates, and sign-off.")
bullet("Coordinated scope, timeline, and the build with the team.")
y -= 4
line("Vice President  |  DDU ICT Club", 10.5, "F2", 13)
bullet("Led a team building interactive web applications and organized workshops.")
y -= 2
line("Full Stack Developer  |  Freelance", 10.5, "F2", 13)
bullet("Built REST APIs, JWT authentication, and responsive client websites.")
y -= 6

heading("Projects")
bullet("Akilil Digital Realm website - project manager and direct client contact.")
bullet("Teter internship repos - Gasha Digital, Abel, and Teter Trending.")
bullet("Event Pulse - event registrations and ticket sales.")
bullet("Traffic Sign Recognition - machine learning model for traffic-sign classification.")
y -= 6

heading("Education")
line("BSc in Computer Science  |  Dire Dawa University  |  Expected 2027", 9.5, "F2")
y -= 6

heading("Technical Skills")
line("Frontend: Next.js, React, JavaScript (ES6+), HTML5, CSS3, Tailwind")
line("Backend: Node.js, Express.js, PHP")
line("Databases: MySQL, PostgreSQL")
line("Tools: Git, GitHub, REST APIs, Postman, VS Code, JWT, responsive design")
y -= 10
fill(0.45, 0.45, 0.45)
line("References available upon request", 8.5)

stream = ("\n".join(ops) + "\n").encode("latin-1", "replace")

objects = [
    b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    b"<< /Length %d >>\nstream\n" % len(stream) + stream + b"endstream",
    b"<< /Type /Page /Parent 5 0 R /MediaBox [0 0 612 792] /Contents 3 0 R /Resources << /Font << /F1 1 0 R /F2 2 0 R >> >> >>",
    b"<< /Type /Pages /Kids [4 0 R] /Count 1 >>",
    b"<< /Type /Catalog /Pages 5 0 R >>",
]

out = bytearray(b"%PDF-1.4\n")
offsets = [0]
for i, payload in enumerate(objects, start=1):
    offsets.append(len(out))
    out.extend(f"{i} 0 obj\n".encode("latin-1"))
    out.extend(payload)
    out.extend(b"\nendobj\n")

xref_pos = len(out)
out.extend(f"xref\n0 {len(objects) + 1}\n".encode("latin-1"))
out.extend(b"0000000000 65535 f \n")
for off in offsets[1:]:
    out.extend(f"{off:010d} 00000 n \n".encode("latin-1"))
out.extend(
    f"trailer\n<< /Size {len(objects) + 1} /Root 6 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n".encode(
        "latin-1"
    )
)

OUT.write_bytes(bytes(out))
print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
