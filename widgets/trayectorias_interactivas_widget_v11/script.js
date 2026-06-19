(() => {
  const RANGE_START = new Date("2021-01-01T00:00:00");
  const RANGE_END = new Date("2026-01-01T00:00:00");

  const schools = [
    {
      id:"pizarnik",
      name:"Escuela Pizarnik",
      color:"#1684f8",
      watermark:"images/pizarnik.png",
      segments:[
        {
          id:"maria-a",
          name:"María A.",
          from:"2021-01-01",
          to:"2024-04-11",
          startLabel:"2011",
          endLabel:"11/04/2024",
          tone:"light",
          color:"linear-gradient(180deg, rgba(74,134,255,.82), rgba(0,198,255,.68))",
          visible:["53 años","22 años de antigüedad docente","Prof. de Inglés","Directora 2011–2024"],
          tooltip:["53 años","22 años de antigüedad docente","Prof. de Inglés","Directora de la escuela Pizarnik entre 2011 y 2024"]
        },
        {
          id:"alfredo",
          name:"Alfredo",
          from:"2024-04-11",
          to:"2025-09-01",
          endLabel:"31/08/2025",
          tone:"dark",
          color:"linear-gradient(180deg, rgba(0,126,255,.90), rgba(0,170,203,.82))",
          visible:["45 años","12 años de antigüedad docente","Prof. de Educación Física","Director 2024–2025"],
          tooltip:["45 años","12 años de antigüedad docente","Prof. de Educación Física","Asumió la dirección en abril de 2024 y renunció en agosto de 2025"]
        },
        {
          id:"otro",
          name:"Otro",
          from:"2025-09-01",
          to:"2026-01-01",
          endLabel:"Actualidad",
          shortDate:"09/2025 · Act.",
          tinyPill:"Act.",
          tone:"dark",
          color:"linear-gradient(180deg, rgba(103,123,150,.92), rgba(130,148,171,.88))",
          visible:["Continuidad institucional"],
          tooltip:["Desde 01/09/2025","Continuidad institucional","Dirección en ejercicio"]
        }
      ],
      transitions:[{label:"Abr. 2024",date:"2024-04-11"},{label:"Sep. 2025",date:"2025-09-01"}]
    },
    {
      id:"walsh",
      name:"Escuela Walsh",
      color:"#a52eff",
      watermark:"images/walsh.jpg",
      segments:[
        {
          id:"susana",
          name:"Susana",
          from:"2021-01-01",
          to:"2024-08-01",
          startLabel:"2018",
          endLabel:"31/07/2024",
          tone:"light",
          color:"linear-gradient(180deg, rgba(177,72,255,.80), rgba(228,134,255,.70))",
          visible:["65 años","36 años de antigüedad docente","Prof. de Matemática, Física y Química","22 años en gestión"],
          tooltip:["65 años","36 años de antigüedad docente","Prof. de Matemática, Física y Química","Directora en períodos interrumpidos, último período 2018–2024"]
        },
        {
          id:"nilda",
          name:"Nilda",
          from:"2024-08-01",
          to:"2026-01-01",
          endLabel:"Actualidad",
          tone:"dark",
          color:"linear-gradient(180deg, rgba(151,36,238,.90), rgba(220,119,255,.82))",
          visible:["42 años","18 años de antigüedad docente","Prof. de Lengua y Literatura","Directora desde agosto de 2024"],
          tooltip:["42 años","18 años de antigüedad docente","Prof. de Lengua y Literatura","Directora desde agosto de 2024"]
        }
      ],
      transitions:[{label:"Ago. 2024",date:"2024-08-01"}]
    },
    {
      id:"galeano",
      name:"Escuela Galeano",
      color:"#00b487",
      watermark:"images/galeano.jpg",
      segments:[
        {
          id:"morticia",
          name:"Morticia",
          from:"2021-01-01",
          to:"2026-01-01",
          startLabel:"2012",
          endLabel:"Actualidad",
          tone:"dark",
          color:"linear-gradient(180deg, rgba(0,165,127,.82), rgba(0,224,178,.70))",
          visible:["55 años","32 años de antigüedad docente","Prof. de Matemática","18 años en cargos directivos"],
          tooltip:["55 años","32 años de antigüedad docente","Prof. de Matemática","Directora titular en la escuela Galeano desde 2012"]
        }
      ],
      transitions:[]
    }
  ];

  const yearMarkersEl = document.querySelector("#year-markers");
  const schoolsGridEl = document.querySelector("#schools-grid");
  const tooltipEl = document.querySelector("#floating-tooltip");
  let activeSchoolId = null;

  const toDate = value => new Date(`${value}T00:00:00`);
  const totalMs = RANGE_END - RANGE_START;
  const pctFromBottom = dateString => ((toDate(dateString) - RANGE_START) / totalMs) * 100;

  const formatDate = dateString => {
    const [y,m,d] = dateString.split("-");
    return `${d}/${m}/${y}`;
  };

  const dateLabel = (segment, short=false) => {
    if (short && segment.shortDate) return segment.shortDate;
    const start = segment.startLabel || formatDate(segment.from);
    const end = segment.endLabel || formatDate(segment.to);
    return `${start} · ${end}`;
  };

  function buildYearMarkers(){
    [2021,2022,2023,2024,2025].forEach(year=>{
      const marker=document.createElement("div");
      marker.className="year-marker";
      marker.style.bottom=`${pctFromBottom(`${year}-01-01`)}%`;
      marker.innerHTML=`<span>${year}</span>`;
      yearMarkersEl.appendChild(marker);
    });
  }

  function buildSegment(school,segment){
    const from = pctFromBottom(segment.from);
    const to = pctFromBottom(segment.to);
    const height = Math.max(0, to - from);

    const isTiny = height < 8.5;
    const isCompact = height >= 8.5 && height < 13.5;
    const isDense = height >= 13.5 && height < 33;

    const el = document.createElement("article");
    el.className = `segment ${segment.tone==="light"?"light":""} ${isDense?"dense":""} ${isCompact?"compact":""} ${isTiny?"tiny":""}`;
    el.tabIndex = 0;
    el.style.bottom = `${from}%`;
    el.style.height = `${height}%`;
    el.style.background = segment.color;

    if (isTiny){
      el.innerHTML = `<div class="segment-content">
        <div class="tiny-row">
          <h3 class="segment-name">${segment.name}</h3>
          <span class="tiny-pill">${segment.tinyPill || "Act."}</span>
        </div>
      </div>`;
    } else {
      const visible = isCompact ? [] : segment.visible;
      el.innerHTML = `<div class="segment-content">
        <h3 class="segment-name">${segment.name}</h3>
        <p class="segment-date">${dateLabel(segment, isCompact)}</p>
        <ul class="segment-details">${visible.map(item=>`<li>${item}</li>`).join("")}</ul>
      </div>`;
    }

    el.addEventListener("mouseenter",e=>showTooltip(e,school,segment));
    el.addEventListener("mousemove",positionTooltip);
    el.addEventListener("mouseleave",hideTooltip);
    el.addEventListener("focus",()=>showTooltipFromElement(el,school,segment));
    el.addEventListener("blur",hideTooltip);
    return el;
  }

  function buildSchoolCard(school){
    const card=document.createElement("section");
    card.className="school-card";
    card.dataset.school=school.id;
    card.style.setProperty("--school-color",school.color);

    card.innerHTML=`<header class="school-header">${school.name}</header>
      <div class="school-body">
        <div class="writer-watermark" style="--watermark:url('${school.watermark}')"></div>
        <div class="school-tint"></div>
      </div>`;

    const body=card.querySelector(".school-body");
    school.segments.forEach(segment=>body.appendChild(buildSegment(school,segment)));

    school.transitions.forEach(transition=>{
      const bottom=pctFromBottom(transition.date);
      const node=document.createElement("div");
      node.className="transition-node";
      node.style.bottom=`calc(${bottom}% - 7px)`;
      body.appendChild(node);

      const label=document.createElement("div");
      label.className="transition-label";
      label.style.bottom=`${bottom}%`;
      label.textContent=transition.label;
      body.appendChild(label);
    });

    card.addEventListener("mouseenter",()=>setHoveredSchool(school.id));
    card.addEventListener("mouseleave",()=>clearHoveredSchool(school.id));
    card.addEventListener("click",e=>{
      if(e.target.closest(".segment")) return;
      toggleActiveSchool(school.id);
    });

    return card;
  }

  function toggleActiveSchool(id){
    activeSchoolId = activeSchoolId === id ? null : id;
    syncFocusState();
  }

  function setHoveredSchool(id){
    document.querySelector(`.school-card[data-school="${id}"]`)?.classList.add("is-hovered");
    schoolsGridEl.classList.add("has-focus");
  }

  function clearHoveredSchool(id){
    document.querySelector(`.school-card[data-school="${id}"]`)?.classList.remove("is-hovered");
    if(!activeSchoolId && !document.querySelector(".school-card.is-hovered")){
      schoolsGridEl.classList.remove("has-focus");
    }
  }

  function syncFocusState(){
    document.querySelectorAll(".school-card").forEach(card=>{
      card.classList.toggle("is-active", card.dataset.school===activeSchoolId);
    });
    schoolsGridEl.classList.toggle("has-focus", Boolean(activeSchoolId || document.querySelector(".school-card.is-hovered")));
  }

  function showTooltip(event,school,segment){
    const detailLines = segment.tooltip || segment.visible;
    tooltipEl.innerHTML=`<h3>${segment.name}</h3>
      <p><strong>${school.name}</strong></p>
      <p>${dateLabel(segment, false)}</p>
      <ul>${detailLines.map(item=>`<li>${item}</li>`).join("")}</ul>`;
    tooltipEl.classList.add("is-visible");
    positionTooltip(event);
  }

  function showTooltipFromElement(el,school,segment){
    const r=el.getBoundingClientRect();
    showTooltip({clientX:r.right+12,clientY:r.top+14},school,segment);
  }

  function positionTooltip(event){
    const margin=16;
    const w=tooltipEl.offsetWidth || 390;
    const h=tooltipEl.offsetHeight || 240;
    let left=event.clientX+18;
    let top=event.clientY+16;
    if(left+w>window.innerWidth-margin) left=event.clientX-w-18;
    if(top+h>window.innerHeight-margin) top=window.innerHeight-h-margin;
    if(top<margin) top=margin;
    tooltipEl.style.left=`${left}px`;
    tooltipEl.style.top=`${top}px`;
  }

  function hideTooltip(){ tooltipEl.classList.remove("is-visible"); }

  function resetView(){
    activeSchoolId=null;
    hideTooltip();
    document.querySelectorAll(".school-card").forEach(card=>card.classList.remove("is-active","is-hovered"));
    schoolsGridEl.classList.remove("has-focus");
  }

  document.addEventListener("keydown",e=>{
    if(e.key==="0"){ resetView(); return; }
    if(e.key==="1"){ activeSchoolId="pizarnik"; syncFocusState(); return; }
    if(e.key==="2"){ activeSchoolId="walsh"; syncFocusState(); return; }
    if(e.key==="3"){ activeSchoolId="galeano"; syncFocusState(); return; }
  });

  document.addEventListener("click",e=>{
    if(!e.target.closest(".school-card")) resetView();
  });

  buildYearMarkers();
  schools.forEach(school=>schoolsGridEl.appendChild(buildSchoolCard(school)));
})();

