const API_URL =
"https://script.google.com/macros/s/AKfycby9VfrE_sn4GHKxwYl9XzMvU7kwFKgjxL0UfCSdnDlirzR90RclNOixi3SJwnBmAxOP/exec";


const LOGO_URL =
"https://drive.google.com/uc?export=view&id=YOUR_LOGO_FILE_ID";


const SUBJECTS = [

{k:'B',n:'B',fm:'Bm',ot:'BT',og:'BG'},

{k:'E',n:'E',fm:'Em',ot:'ET',og:'EG'},

{k:'Hn',n:'Hn',fm:'Hnm',ot:'HnT',og:'HnG'},

{k:'Br',n:'Br',fm:'Brm',ot:'BrT',og:'BrG'},

{k:'Er',n:'Er',fm:'Erm',ot:'ErT',og:'ErG'},

{k:'Gk',n:'Gk',fm:'Gkm',ot:'GkT',og:'GkG'},

{k:'C',n:'C',fm:'Cm',ot:'CT',og:'CG'},

{k:'Ev',n:'Ev',fm:'Evm',ot:'EvT',og:'EvG'},

{k:'M',n:'M',fm:'Mm',ot:'MT',og:'MG'},

{k:'Ls',n:'Ls',fm:'Lsm',ot:'LsT',og:'LsG'},

{k:'Ps',n:'Ps',fm:'Psm',ot:'PsT',og:'PsG'},

{k:'Hs',n:'Hs',fm:'Hsm',ot:'HsT',og:'HsG'},

{k:'Ge',n:'Ge',fm:'Gem',ot:'GeT',og:'GeG'}

];


function v(data,key){

return String(
data[key] || ''
).trim();
}


function isActive(data,s){

const raw =
v(data,s.fm).toLowerCase();

return !(
raw === '' ||
raw === '0' ||
raw === 'n'
);
}


function showErr(msg){

const el =
document.getElementById(
'ifaceError'
);

el.innerText = msg;

el.style.display='block';
}


/* =========================
LOAD CLASSES
========================= */

fetch(
API_URL + '?action=getClasses'
)

.then(res => res.json())

.then(classes => {

const sel =
document.getElementById(
'classSelect'
);

classes.forEach(c => {

const opt =
document.createElement(
'option'
);

opt.value = c;

opt.textContent = c;

sel.appendChild(opt);

});

})

.catch(() => {

showErr(
'Class Loading Failed'
);

});


/* =========================
LOAD STUDENTS
========================= */

document
.getElementById(
'classSelect'
)

.addEventListener(
'change',

function(){

const cls = this.value;

const studSel =
document.getElementById(
'studentSelect'
);

studSel.innerHTML =
'<option disabled selected>STUDENTS_NAME</option>';

fetch(

API_URL +
'?action=getStudents&className=' +
encodeURIComponent(cls)

)

.then(res => res.json())

.then(list => {

list.forEach(st => {

const opt =
document.createElement(
'option'
);

opt.value = st.id;

opt.textContent = st.name;

studSel.appendChild(opt);

});

studSel.disabled = false;

});

}
);


/* =========================
ENABLE BUTTON
========================= */

document
.getElementById(
'studentSelect'
)

.addEventListener(
'change',

function(){

document
.getElementById(
'viewBtn'
)
.disabled = false;

}
);


/* =========================
VIEW RESULT
========================= */

document
.getElementById(
'viewBtn'
)

.addEventListener(
'click',

function(){

const sid =
document.getElementById(
'studentSelect'
).value;

fetch(

API_URL +
'?action=getResult&studentId=' +
encodeURIComponent(sid)

)

.then(res => res.json())

.then(data => {

renderCard(data);

document
.getElementById(
'interfacePage'
)
.style.display='none';

document
.getElementById(
'resultPage'
)
.style.display='block';

window.scrollTo(0,0);

});

}
);


/* =========================
GO BACK
========================= */

function goBack(){

document
.getElementById(
'resultPage'
)
.style.display='none';

document
.getElementById(
'interfacePage'
)
.style.display='flex';

window.scrollTo(0,0);
}


/* =========================
RENDER RESULT
========================= */

function renderCard(d){

let rows='';

SUBJECTS.forEach(s => {

if(!isActive(d,s)) return;

rows += `

<tr>

<td class="subj-cell">

${v(d,s.n)}

</td>

<td class="obt">

${v(d,s.ot)}

</td>

<td class="obt">

${v(d,s.og)}

</td>

</tr>

`;

});


const html = `

<div class="result-card">

<div class="cert-no">

Certificate No.
${v(d,'I_D')}

</div>

<div class="card-top">

<img
class="school-logo"
src="${LOGO_URL}">

<div class="card-school-name">

SHRIPUR KINDERGARTEN SCHOOL

</div>

<img
class="qr-img"
src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${v(d,'I_D')}">

</div>

<div class="card-subtitle">

Progress Report Card of
First Summative Evaluation,
2026

</div>

<hr class="card-divider">

<div class="student-info">

<span>

CLASS:
<strong>
${v(d,'CLASS')}
</strong>

</span>

<span>

ROLL:

<span class="info-box">

${v(d,'ROLL')}

</span>

</span>

</div>

<div class="student-info">

<span>

Name:

<strong>

${v(d,'STUDENT_NAME')}

</strong>

</span>

</div>

<div class="section-heading">

Assessment of Academic Areas

</div>

<table class="marks-table">

<thead>

<tr>

<th>Subject</th>

<th>Total</th>

<th>Grade</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

<div class="card-actions">

<button
class="card-action-btn"
onclick="window.print()">

🖨 Print

</button>

<button
class="card-action-btn"
onclick="window.print()">

⬇ Download

</button>

</div>

</div>

`;

document
.getElementById(
'resultContainer'
)
.innerHTML = html;
}
