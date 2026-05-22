const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyOnxQqelRC93Xmx61AHsmX3XsB6u3qKK_LtY0miKigHQGwH2fz75Ho1hxy8YoYYsYWQQ/exec";

let allStudents = [];

/* =========================
   LOAD DATA
========================= */

window.onload = async () => {
  try {
    const response = await fetch(WEB_APP_URL);
    const data = await response.json();
    allStudents = data;
    loadClasses();
  } catch (error) {
    console.error(error);
    alert("Failed to load data");
  }
};

/* =========================
   LOAD CLASSES
========================= */

function loadClasses() {
  const classSelect = document.getElementById("classSelect");
  const classes = [...new Set(allStudents.map(s => s.CLASS))];
  classes.forEach(cls => {
    const option = document.createElement("option");
    option.value = cls;
    option.textContent = cls;
    classSelect.appendChild(option);
  });
}

/* =========================
   LOAD STUDENTS
========================= */

document.getElementById("classSelect").addEventListener("change", function () {
  const selectedClass = this.value;
  const studentSelect = document.getElementById("studentSelect");
  studentSelect.innerHTML = `<option value="">STUDENTS_NAME</option>`;
  const filtered = allStudents.filter(s => s.CLASS === selectedClass);
  filtered.forEach(student => {
    const option = document.createElement("option");
    option.value = student.I_D;
    option.textContent = student.STUDENTS_NAME;
    studentSelect.appendChild(option);
  });
});

/* =========================
   VIEW RESULT
========================= */

document.getElementById("viewResultBtn").addEventListener("click", function () {
  const studentId = document.getElementById("studentSelect").value;
  if (!studentId) {
    alert("Please select student");
    return;
  }
  const student = allStudents.find(s => s.I_D == studentId);
  generateResult(student);
});

/* =========================
   SUBJECT MAPPING
========================= */

const subjects = [
  { name: "Bengali",          fm: "FMB",    written: "WTB",    oral: "OLB",    total: "TTB",    percentage: "PCB",    grade: "GDB"    },
  { name: "English",          fm: "FME",    written: "WTE",    oral: "OLE",    total: "TTE",    percentage: "PCE",    grade: "GDE"    },
  { name: "Math",             fm: "FMM",    written: "WTM",    oral: "OLM",    total: "TTM",    percentage: "PCM",    grade: "GDM"    },
  { name: "Hindi",            fm: "FMHN",   written: "WTHN",   oral: "OLHN",   total: "TTHN",   percentage: "PCHN",   grade: "GDHN"   },
  { name: "Computer",         fm: "FMCM",   written: "WTCM",   oral: "OLCM",   total: "TTCM",   percentage: "PCCM",   grade: "GDCM"   },
  { name: "Rhymes Bengali",   fm: "FMRYMB", written: "WTRYMB", oral: "OLRYMB", total: "TTRYMB", percentage: "PCRYMB", grade: "GDRYMB" },
  { name: "Rhymes English",   fm: "FMRYME", written: "WTRYME", oral: "OLRYME", total: "TTRYME", percentage: "PCRYME", grade: "GDRYME" },
  { name: "GK",               fm: "FMGK",   written: "WTGK",   oral: "OLGK",   total: "TTGK",   percentage: "PCGK",   grade: "GDGK"   },
  { name: "EVS",              fm: "FMEV",   written: "WTEV",   oral: "OLEV",   total: "TTEV",   percentage: "PCEV",   grade: "GDEV"   },
  { name: "History",          fm: "FMHS",   written: "WTHS",   oral: "OLHS",   total: "TTHS",   percentage: "PCHS",   grade: "GDHS"   },
  { name: "Geography",        fm: "FMG",    written: "WTG",    oral: "OLG",    total: "TTG",     percentage: "PCG",    grade: "GDG"    },
  { name: "Life Science",     fm: "FMLSC",  written: "WRLSC",  oral: "OLLSC",  total: "TTLSC",  percentage: "PCLSC",  grade: "GDLSC"  },
  { name: "Physical Science", fm: "FMPSC",  written: "WTPSC",  oral: "OLPSC",  total: "TTPSC",  percentage: "PCPSC",  grade: "GDPSC"  }
];

/* =========================
   FM BREAKDOWN LOGIC
   ─────────────────────────
   FM = 100  → Written FM = 90,   Oral FM = 10
   FM = 25   → Written FM = hide, Oral FM = 25
   FM = 50   → if WT = "N"  → Written FM = hide, Oral FM = 50
               if WT ≠ "N"  → Written FM = 45,   Oral FM = 5
   অন্য যেকোনো FM → Written FM = hide, Oral FM = FM
========================= */

function getFMBreakdown(fm, wtRawValue) {
  const wtIsNull =
    wtRawValue === "N" ||
    wtRawValue === "n" ||
    wtRawValue === "" ||
    wtRawValue === null ||
    wtRawValue === undefined;

  if (fm === 100) {
    return { fmWritten: 90, fmOral: 10, showWritten: true };
  }

  if (fm === 25) {
    return { fmWritten: null, fmOral: 25, showWritten: false };
  }

  if (fm === 50) {
    if (wtIsNull) {
      return { fmWritten: null, fmOral: 50, showWritten: false };
    } else {
      return { fmWritten: 45, fmOral: 5, showWritten: true };
    }
  }

  // অন্য যেকোনো FM মান — Oral only
  return { fmWritten: null, fmOral: fm, showWritten: false };
}

/* =========================
   GENERATE RESULT
========================= */

function generateResult(student) {

  document.getElementById("resultWrapper").classList.remove("hidden");

  document.getElementById("certificateNo").textContent  = student.I_D;
  document.getElementById("studentName").textContent    = student.STUDENTS_NAME;
  document.getElementById("fatherName").textContent     = student.FATHERS_NAME;
  document.getElementById("studentClass").textContent   = student.CLASS;
  document.getElementById("rollNumber").textContent     = student.ROLL;

  const tbody = document.getElementById("subjectTableBody");
  tbody.innerHTML = "";

  subjects.forEach(sub => {

    const fm = Number(student[sub.fm]);

    // FM = 0 বা blank হলে subject skip করো
    if (!fm || fm <= 0) return;

    const wtRaw          = student[sub.written];
    const wtIsNull       =
      wtRaw === "N" || wtRaw === "n" ||
      wtRaw === "" || wtRaw === null || wtRaw === undefined;

    const writtenObtained = wtIsNull ? "-" : Number(wtRaw);
    const oral            = Number(student[sub.oral]       || 0);
    const total           = Number(student[sub.total]      || 0);
    const percentage      = Number(student[sub.percentage] || 0);
    const grade           = student[sub.grade] || "-";

    // Full Marks breakdown
    const { fmWritten, fmOral, showWritten } = getFMBreakdown(fm, wtRaw);

    const fmWrittenCell   = showWritten ? fmWritten : "-";
    const wtObtainedCell  = showWritten ? writtenObtained : "-";

    const row = `
      <tr>
        <td>${sub.name}</td>

        <!-- Full Marks: Written | Oral | Total -->
        <td>${fmWrittenCell}</td>
        <td>${fmOral}</td>
        <td>${fm}</td>

        <!-- Obtained Marks: Written | Oral | Total | % | Grade -->
        <td>${wtObtainedCell}</td>
        <td>${oral}</td>
        <td>${total}</td>
        <td>${percentage.toFixed(2)}%</td>
        <td>${grade}</td>
      </tr>
    `;

    tbody.innerHTML += row;
  });

  /* =========================
     FINAL SUMMARY
  ========================== */

  document.getElementById("grandFullMarks").textContent  = student.FM;
  document.getElementById("grandTotal").textContent      = student.GTT;
  document.getElementById("grandPercentage").textContent = Number(student.PCGTT).toFixed(2) + "%";
  document.getElementById("grandGrade").textContent      = student.GDGTT;
  document.getElementById("grandRank").textContent       = student.ORD;

  // Result card-এ smooth scroll
  document.getElementById("resultWrapper").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* =========================
   PRINT
========================= */

function printResult() {
  window.print();
}

/* =========================
   DOWNLOAD PDF
========================= */

function downloadPDF() {
  const element = document.getElementById("marksheet");

  const options = {
    margin: 0,
    filename: "Result_Marksheet.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(options).from(element).save();
}
