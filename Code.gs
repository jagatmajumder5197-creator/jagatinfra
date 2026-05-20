// ============================================================
//   Result_Jagat – Code.gs
//   School: Shripur Kindergarten School
//   Engine: Google Apps Script + GitHub
// ============================================================

const MASTER_SHEET_ID = '1mr9kLXOQcP89ysyj8ZZ9nmFpi2jDSUz2DuFr_9_KNw8';

// ── Logo: searches Drive for Logo_Jagat.png by name ─────────
function getLogoUrl() {
  try {
    var files = DriveApp.getFilesByName('Logo_Jagat.png');
    if (files.hasNext()) {
      var file = files.next();
      // Make sure it is viewable by anyone with link
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return 'https://drive.google.com/uc?export=view&id=' + file.getId();
    }
    return '';   // file not found → img will be hidden gracefully
  } catch (err) {
    Logger.log('getLogoUrl error: ' + err);
    return '';
  }
}

// ── Entry Point ──────────────────────────────────────────────
function doGet(e) {
  var tmpl = HtmlService.createTemplateFromFile('Index');
  tmpl.logoUrl = getLogoUrl();   // passes logo URL as template variable
  return tmpl.evaluate()
    .setTitle('Result | Shripur Kindergarten School')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── Helper: open master sheet ────────────────────────────────
function _getMasterData() {
  const ss  = SpreadsheetApp.openById(MASTER_SHEET_ID);
  const sh  = ss.getSheets()[0];
  return sh.getDataRange().getValues();   // [0] = header row
}

// ── Get unique CLASS values ──────────────────────────────────
function getClasses() {
  try {
    const data = _getMasterData();
    const seen = new Set();
    const out  = [];
    for (let i = 1; i < data.length; i++) {
      const id  = String(data[i][0]).trim();
      const cls = String(data[i][2]).trim();
      if (id && cls && !seen.has(cls)) {
        seen.add(cls);
        out.push(cls);
      }
    }
    return out.sort();
  } catch (err) {
    Logger.log('getClasses error: ' + err);
    return [];
  }
}

// ── Get students for a given class ──────────────────────────
function getStudentsByClass(className) {
  try {
    const data = _getMasterData();
    const out  = [];
    for (let i = 1; i < data.length; i++) {
      const id   = String(data[i][0]).trim();
      const cls  = String(data[i][2]).trim();
      const name = String(data[i][5]).trim();
      if (id && cls === className) {
        out.push({ id: id, name: name });
      }
    }
    return out;
  } catch (err) {
    Logger.log('getStudentsByClass error: ' + err);
    return [];
  }
}

// ── Get full result row for a student ID ────────────────────
function getStudentResult(studentId) {
  try {
    const data    = _getMasterData();
    const headers = data[0];
    const sid     = String(studentId).trim();

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === sid) {
        const result = {};
        headers.forEach(function (h, idx) {
          result[String(h).trim()] = data[i][idx];
        });
        return result;
      }
    }
    return null;                 // not found
  } catch (err) {
    Logger.log('getStudentResult error: ' + err);
    return null;
  }
}
