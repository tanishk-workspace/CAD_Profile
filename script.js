// ===== Elements =====

const divider = document.getElementById('divider');
const canvasPane = document.getElementById('canvasPane');
const objPane = document.getElementById('objPane');
const table = document.getElementById('bottomPane');
const collapseMetaBtn = document.getElementById('collapseMetaBtn');
const MetaData = document.getElementById('MetaData');

const cadViewer = document.getElementById('cadViewer');

const panBtn = document.getElementById('panBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');

const menuToggle = document.getElementById('menuToggle');
const mobileAssetsDrawer = document.getElementById('mobile-assets-drawer');

const initBtn = document.getElementById('initBtn');
const testBtn = document.getElementById('testBtn');
const overly = document.getElementById('overlay');

const adBtn = document.getElementById('adBtn');
const remBtn = document.getElementById('remBtn');

const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
 // Ensure this ID matches your HTML

const GlbObj=[
{name:'Default', path:"./assets/glb/default.glb",thumbnailPath:'./assets/img/default.png'},
{name:'SPR Structure',path:"./assets/glb/design_1.glb",thumbnailPath:'./assets/img/SPR_Structure.png'},
{name:'NG Dome',path:'./assets/glb/non_geodesic_dome.glb',thumbnailPath:'./assets/img/NG_Dome.png'}];

// ===== State =====
let isDraggingDivider = false;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let isPanning = false;
let isPanMode = true; // Starts in Pan Mode
let startX = 0;
let startY = 0;
let currentscale = 1.0;
let dropdown_choice=false;
let metaCollapse=false;
let selectedGlb= "";

//===== Assets DOM class=====
class AvailableObjs {
   constructor(name,path,thumbnailPath) {
      this.name = name;
      this.nameMobile = 'mobile-'+name;
      this.path = path;
      this.thumbnailPath = thumbnailPath;
   }

   #buildCard(cardId) {
     const card = document.createElement("div");
     card.classList.add("glbCard");
     card.id = cardId;

     const thumbnailImg = document.createElement("img")
     thumbnailImg.classList.add("thumbnail");
     thumbnailImg.src=this.thumbnailPath;
     thumbnailImg.alt="Not-found";
     card.appendChild(thumbnailImg);
 
     const thumbnailLabel = document.createElement("span");
     thumbnailLabel.classList.add("iconLabel");
     thumbnailLabel.textContent=this.name;
     card.appendChild(thumbnailLabel);

     card.addEventListener('click', async () => {
         console.log(`${this.name} button triggered`);

         const desktopTwin = document.getElementById(this.name);
         const mobileTwin = document.getElementById(this.nameMobile);
         const twins = [desktopTwin, mobileTwin];

         if(this.path===selectedGlb){
             console.log('logic segement check');
             cadViewer.src='';
             twins.forEach(twin => {
                 if (twin) {
                     twin.style.background = '';
                     twin.style.border = '';
                 }
             });
     }
      else{
             console.log(this.path,'in else');
             selectedGlb=`${this.path}`;
             cadViewer.src=selectedGlb;
             document.querySelectorAll('.glbCard').forEach(c => {
                  c.style.background = '';
                  c.style.border = '';});

            
               twins.forEach(twin => {
                if (twin) {
                   twin.style.background = '#38383d';
                   twin.style.border = '2px solid #888';
                }
             });
         }
      });
return card;
}
injectDOM() {
      const desktopCard = this.#buildCard(this.name);
      objPane.appendChild(desktopCard);

      const mobileCard = this.#buildCard(this.nameMobile);
      mobileobjPane.appendChild(mobileCard);
   }
}

GlbObj.forEach(Obj=>{
   const instance = new AvailableObjs(Obj.name, Obj.path, Obj.thumbnailPath);
   instance.injectDOM();
});

// Initialize Overlay State
function updateInteraction() {
  if (isPanMode) {
    overly.style.pointerEvents = "none"; // Clicks pass through to canvas
    canvasPane.style.cursor = "grab";
    panBtn.style.background = "#666";
  } else {
    overly.style.pointerEvents = "auto"; // Overlay blocks canvas
    canvasPane.style.cursor = "default";
    panBtn.style.background = "#444";
  }
  if(selectedGlb){
    cadViewer.src=selectedGlb;
  }
}
updateInteraction();


// ===== Divider Resize =====
divider.addEventListener('mousedown', (e) => {
  isDraggingDivider = true;
  e.preventDefault();
});

window.addEventListener('mouseup', () => {
  isDraggingDivider = false;
  isPanning = false;
  // ===== ADD PANNING LOGIC ===== 
});

window.addEventListener('mousemove', (e) => {
  if (isDraggingDivider) {
    const newWidth = e.clientX;
    canvasPane.style.flex = "none";
    canvasPane.style.width = newWidth + "px";
    objPane.style.flex = "1";
    return;
  }

  if (!isPanning || !isPanMode) return;
});

// ===== Pan Logic =====

// ===== Toolbar Actions =====
panBtn.onclick = () => {
 isPanMode = !isPanMode;
 console.log('pan btn triggered');
 updateInteraction();
};

zoomInBtn.onclick = () => {
 console.log('zoom btn triggered');
};
zoomOutBtn.onclick = () => { 
 console.log('zoom btn triggered');
};

initBtn.addEventListener('click', () => {
  console.log('init button triggered');
});

testBtn.addEventListener('click', () => {
 console.log('test button triggered');
});


adBtn.addEventListener('click', async () => {
 console.log('add button triggered');
 selectedGlb= './assets/default.glb';
 cadViewer.src= selectedGlb;
});

remBtn.addEventListener('click', async () => {
  console.log('remove button triggered');
});

collapseMetaBtn.addEventListener('click', () => {
metaCollapse=!metaCollapse;
if(metaCollapse){
 MetaData.style.display = "none";}
else{
 MetaData.style.display = "block";}
});


exportBtn.addEventListener('click', async () => {
  const jsonString = JSON.stringify(fileArry, null, 2);
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'data.json',
        types: [{ accept: { 'application/json': ['.json'] } }]
      });
      const writable = await handle.createWritable();
      await writable.write(jsonString);
      await writable.close();
    } catch (err) {
      console.log("User cancelled the save dialogue.");
    }
  } 
  else {
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    link.click();
    URL.revokeObjectURL(link.href);
    alert("Saved to your default Downloads folder (Browser does not support 'Save As' dialogue)");
  }
});


async function importing() {
    if ('showOpenFilePicker' in window) {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] }
                }],
                multiple: false
            });
            const file = await fileHandle.getFile();
            const contents = await file.text();
            return JSON.parse(contents);
        } catch (err) {
            if (err.name !== 'AbortError') console.error("Import failed:", err);
            return null;
        }
    } 
    else {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) {
                    resolve(null);
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        resolve(JSON.parse(event.target.result));
                    } catch (err) {
                        console.error("Invalid JSON", err);
                        resolve(null);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }
}

importBtn.addEventListener('click', async () => {
   const data = await importing();
   
   if (data) {
       fileArry = data;
       renderChart();  //Only render if data was actually returned
   }
});

document.addEventListener('click', (event) => {
        if (event.target !== adBtn && event.target !== addropdown) {
        addropdown.style.display = "none";
    }
}); // This rarely works.

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  mobileAssetsDrawer.classList.toggle('open');
});