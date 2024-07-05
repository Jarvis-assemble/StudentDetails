
document.addEventListener('DOMContentLoaded', () => {

console.log('inside script')

const searchField = document.getElementById('search');
const clearButton = document.getElementById('clearButton');
const searchButton=document.getElementById('searchButton');
const rangeButton=document.getElementById('rangeButton');

const departmentFilter = document.getElementById('departmentFilter');
const cutoffMin = document.getElementById('cutoffMin');
const cutoffMax = document.getElementById('cutoffMax');


async function getStudents(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const data = await response.json();
            return data.reverse();
        }
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
}

const rowsPerPage = 5;
let currentPage = 1;

function populateStudentTable(data) {
    const studentTable = document.getElementById('studentTable').getElementsByTagName('tbody')[0];

    // Clear existing rows
    while (studentTable.rows.length > 0) {
        studentTable.deleteRow(0);
    }

    
    data.forEach((student) => {
        const row = studentTable.insertRow();

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.dept}</td>
            <td>${student.email}</td>
            <td>${student.telNo}</td>
            <td>${student.cutoff}</td>
            <td>${student.bday}</td>
            <td>${student.inputCity}</td>
            <td>${student.inputState}</td>
            <td>${student.inputZip}</td>
            <td><img src="http://localhost:3000/images/${student.avatarPath}" alt="Profile Pic" style="width: 50px; height: 50px;"></td>
            <td><a href="#" onclick="viewDetails('${student.id}')"><i class="fa fa-eye"></i></a></td>
        `;
    });
}


function displayTable(pageNumber, totalPages, data) {

  const startIndex = (pageNumber - 1) * rowsPerPage;
  const endIndex=startIndex + rowsPerPage;
  const slicedData = data.slice(startIndex, endIndex);

  populateStudentTable(slicedData); // Populate table with sliced data

  const totalEntries=(data.length);
  const info=document.getElementById("msg")
  if(!totalPages)
    {info.innerHTML=`<p>No matching entries</p>`}
  else if(pageNumber==totalPages)
    {info.innerHTML=`<p>Showing ${startIndex+1} to ${totalEntries} of ${totalEntries} entries</p>`}
  else
    {info.innerHTML=`<p>Showing ${startIndex+1} to ${endIndex+1} of ${totalEntries} entries</p>`}
  updatePagination(pageNumber,totalPages,data); 
}

function updatePagination(currentPage,pageCount,data) { 
 
  const paginationContainer = document.getElementById("pagination"); 
  paginationContainer.innerHTML = ""; 
  
  
  const prevArrow = document.createElement('span');
  prevArrow.className = 'arrow';
  prevArrow.textContent = '←';
  prevArrow.addEventListener('click', function () {
      if (currentPage > 1) {
          displayTable(currentPage - 1, pageCount, data);
      }
  });
  paginationContainer.appendChild(prevArrow);

  for (let i = 1; i <= pageCount; i++) { 
      const pageLink = document.createElement("a"); 
      pageLink.href = "#"; 
      pageLink.innerText = i; 
      pageLink.onclick = function () { 
          displayTable(i,pageCount,data); 
      }; 
      if (i === currentPage) { 
          pageLink.style.fontWeight = "bold"; 
      } 
      paginationContainer.appendChild(pageLink); 
      paginationContainer.appendChild(document.createTextNode(" ")); 
  } 

  const nextArrow = document.createElement('span');
  nextArrow.className = 'arrow';
  nextArrow.textContent = '→';
  nextArrow.addEventListener('click', function () {
      if (currentPage < pageCount) {
          displayTable(currentPage + 1, pageCount,data);
      }
  });
  paginationContainer.appendChild(nextArrow);
} 

async function pagesSetup() {

    const apiUrl = 'http://localhost:3000/students/'; //vary api for filter
  
    try {
      const studentData = await getStudents(apiUrl); // Fetch student data

      settingup(studentData);

       departmentFilter.addEventListener('change', () => {filterAndSearch();});

       searchButton.addEventListener('click', () => {filterAndSearch();});
       
       rangeButton.addEventListener('click', ()=> {filterAndSearch()});

       function filterAndSearch() { 
         console.log("Event triggered")
           let filteredData = studentData;

           const deptval=departmentFilter.value;
           if (deptval) {
              filteredData = filteredData.filter(student => student.dept === deptval);
            }

            const searchval = searchField.value.trim();
            if (searchval !== '') {
             filteredData = filteredData.filter(student => student.name === searchval);
             }
            
            const minCutoff = parseFloat(cutoffMin.value);
            const maxCutoff = parseFloat(cutoffMax.value);

            //console.log(minCutoff,maxCutoff)

            filteredData=filteredData.filter((student)=>(student.cutoff >= minCutoff && student.cutoff <= maxCutoff ))
            
        settingup(filteredData);

      }

      clearButton.addEventListener('click', function () {
        searchButton.value = '';
        departmentFilter.value = '';
        settingup(studentData);
     });

    } catch (error) {
      console.error('Error initializing page:', error);
    }
  }
  
//gets json data as input and renders table
async function settingup(studentData) {
 console.log("settingup")
  try {
    const totalPages = Math.ceil(studentData.length / rowsPerPage); 

    displayTable(currentPage, totalPages, studentData);

    return;

  } catch (error) {
    console.error('Error initializing page:', error);
  }
}


pagesSetup();

})

 
async function viewDetails(studentId) {
  try {
      const response = await fetch(`http://localhost:3000/students/${studentId}`);
      const student = await response.json();
      document.getElementById('editForm').style.display = 'flex';
      document.getElementById('studentId').value = student.id;
      document.getElementById('studentName').value = student.name;
      document.getElementById('studentGender').value = student.gender;
      document.getElementById('studentDept').value = student.dept;
      document.getElementById('studentEmail').value = student.email;
      document.getElementById('studentTelNo').value = student.telNo;
      document.getElementById('studentCutoff').value = student.cutoff;
      document.getElementById('studentBday').value = student.bday;
      document.getElementById('studentCity').value = student.inputCity;
      document.getElementById('studentState').value = student.inputState;
      document.getElementById('studentZip').value = student.inputZip;
      document.getElementById('image').src=`http://localhost:3000/images/${student.avatarPath}`
  } catch (error) {
      console.error('Error fetching student details:', error);
  }
}
