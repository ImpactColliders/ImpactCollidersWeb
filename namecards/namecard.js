/* ============================================================
   DIGITAL NAME CARDS — shared renderer
   Reads window.NAMECARD_SLUG, looks up window.NAMECARDS[slug],
   renders the card, and wires up the "Save Contact" (vCard) button.
   ============================================================ */
(function(){

  function esc(s){
    return String(s == null ? "" : s)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;");
  }

  // --- icons (inline SVG, stroke-based to match the site) ---
  var icons = {
    phone:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    email:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    linkedin:'<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.81a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.53v-4.58c0-2.45-1.31-3.59-3.06-3.59a2.64 2.64 0 0 0-2.39 1.31h-.04V9.99h-2.56v8.35h2.67v-4.13c0-1.09.21-2.14 1.56-2.14 1.33 0 1.35 1.24 1.35 2.21v4.06h2.67z"/></svg>',
    save:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>'
  };

  // --- build a vCard 3.0 string ---
  function buildVCard(c){
    var parts = c.name.trim().split(/\s+/);
    var last = parts.length > 1 ? parts.pop() : "";
    var first = parts.join(" ");
    var lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:" + last + ";" + first + ";;;",
      "FN:" + c.name
    ];
    if(c.org)   lines.push("ORG:" + c.org);
    if(c.title) lines.push("TITLE:" + c.title);
    if(c.phone) lines.push("TEL;TYPE=CELL:" + c.phone);
    if(c.email) lines.push("EMAIL;TYPE=INTERNET:" + c.email);
    if(c.linkedin) lines.push("URL:" + c.linkedin);
    lines.push("END:VCARD");
    return lines.join("\r\n");
  }

  function downloadVCard(c){
    var blob = new Blob([buildVCard(c)], {type:"text/vcard;charset=utf-8"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = c.name.replace(/\s+/g,"_") + ".vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1500);
  }

  function render(){
    var mount = document.getElementById("namecard");
    var slug = window.NAMECARD_SLUG;
    var c = (window.NAMECARDS || {})[slug];

    if(!c){
      document.title = "Card not found – Impact Colliders";
      mount.innerHTML =
        '<div class="nc-missing">' +
          '<h1>Card not found</h1>' +
          '<p>This digital name card doesn’t exist or has been moved.</p>' +
          '<div class="nc-foot"><a href="/">Go to Impact Colliders</a></div>' +
        '</div>';
      return;
    }

    document.title = c.name + (c.org ? " – " + c.org : "");

    var html = '';
    html += '<div class="nc-brand"><a href="/"><img src="/assets/images/Impact Colliders_Black.png" alt="Impact Colliders"></a></div>';
    html += '<div class="nc-card">';
    html +=   '<img class="nc-photo" src="' + esc(c.photo) + '" alt="' + esc(c.name) + '">';
    html +=   '<h1 class="nc-name">' + esc(c.name) + '</h1>';
    // subtitle = "Title | Org" (either part optional)
    var subtitle = [c.title, c.org].filter(Boolean).join(" | ");
    if(subtitle) html += '<p class="nc-title">' + esc(subtitle) + '</p>';
    html +=   '<div class="nc-actions' + (subtitle ? '' : ' nc-actions--top') + '">';
    if(c.phone)    html += '<a class="nc-btn nc-btn--primary" href="tel:' + esc(c.phone) + '">' + icons.phone + 'Call</a>';
    if(c.email)    html += '<a class="nc-btn" href="mailto:' + esc(c.email) + '">' + icons.email + 'Email</a>';
    if(c.linkedin) html += '<a class="nc-btn" href="' + esc(c.linkedin) + '" target="_blank" rel="noopener">' + icons.linkedin + 'LinkedIn</a>';
    html +=     '<button type="button" class="nc-btn nc-btn--accent" id="nc-save">' + icons.save + 'Save Contact</button>';
    html +=   '</div>';
    html += '</div>';

    mount.innerHTML = html;

    var saveBtn = document.getElementById("nc-save");
    if(saveBtn) saveBtn.addEventListener("click", function(){ downloadVCard(c); });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }

})();
