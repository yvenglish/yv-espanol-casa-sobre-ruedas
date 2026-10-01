const rooms=[
  ["apartamento","el piso / el apartamento","el apartamento / el departamento"],
  ["banheiro","el baño","el baño"],["cozinha","la cocina","la cocina"],["corredor","el pasillo","el pasillo"],
  ["escritório doméstico","el despacho","el estudio / la oficina"],["garagem","el garaje","el garaje / la cochera"],
  ["jardim","el jardín","el jardín"],["lavanderia","el lavadero","la lavandería / el cuarto de lavado"],
  ["quarto","el dormitorio / la habitación","el cuarto / la habitación / la recámara"],
  ["sala de estar","el salón / la sala de estar","la sala / la sala de estar"],["sala de jantar","el comedor","el comedor"],
  ["terraço","la terraza","la terraza"],["varanda","el balcón","el balcón"]
];
const roomTable=document.querySelector("#rooms-table");
rooms.forEach(([pt,es,latam])=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${pt}</td><td><strong>${es}</strong></td><td>${latam}</td><td><button class="audio-btn" type="button" data-speech="${es}" aria-label="Escuchar ${es}">🔊</button></td>`;roomTable.appendChild(tr)});

const videoWords=[
  ["la furgoneta","a van / o furgão"],["una casa sobre ruedas","uma casa sobre rodas"],["construir","construir"],
  ["vivir","morar / viver"],["viajar","viajar"],["tener espacio","ter espaço"]
];
const vocab=document.querySelector("#video-vocab");
videoWords.forEach(([es,pt])=>{const card=document.createElement("article");card.className="word-card";card.innerHTML=`<strong>${es}</strong><button class="audio-btn" type="button" data-speech="${es}" aria-label="Escuchar ${es}">🔊</button><p>${pt}</p>`;vocab.appendChild(card)});

function speak(text){if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="es-ES";const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang.toLowerCase()==="es-es")||voices.find(v=>v.lang.toLowerCase().startsWith("es"))||null;u.rate=.88;speechSynthesis.speak(u)}
document.addEventListener("click",e=>{const btn=e.target.closest("[data-speech]");if(btn)speak(btn.dataset.speech)});

const dialog=document.querySelector("#poster-dialog");
document.querySelector("#open-poster").addEventListener("click",()=>dialog.showModal());
document.querySelector("#close-poster").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});

const normalize=value=>value.trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
document.querySelector("#check-answers").addEventListener("click",()=>{const inputs=[...document.querySelectorAll("[data-answer]")];let hits=0;inputs.forEach(input=>{const ok=normalize(input.value)===normalize(input.dataset.answer);input.classList.toggle("correct",ok);input.classList.toggle("wrong",!ok);if(ok)hits++});document.querySelector("#score").textContent=`${hits} de ${inputs.length} respuestas correctas.${hits===inputs.length?" ¡Excelente!":" Revisa las respuestas marcadas."}`});

document.querySelector("#lesson-date").value=new Date().toLocaleDateString("en-CA");
const form=document.querySelector("#lesson-form"),status=document.querySelector("#form-status"),submit=form.querySelector(".submit-btn");
form.addEventListener("submit",async e=>{e.preventDefault();submit.disabled=true;submit.firstChild.textContent="Enviando... ";status.textContent="";try{const response=await fetch(form.action,{method:"POST",body:new FormData(form)}),result=await response.json();if(!result.success)throw new Error();status.textContent="¡Actividad enviada con éxito!";status.className="form-status success"}catch{status.textContent="No fue posible enviar la actividad. Comprueba tu conexión e inténtalo de nuevo.";status.className="form-status error"}finally{submit.disabled=false;submit.firstChild.textContent="Enviar mi actividad "}});
