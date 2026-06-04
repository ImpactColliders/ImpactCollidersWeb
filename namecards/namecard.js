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
    instagram:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    qr:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><line x1="14" y1="14" x2="14" y2="17"/><line x1="14" y1="21" x2="17" y2="21"/><line x1="21" y1="14" x2="21" y2="21"/><line x1="17" y1="17" x2="21" y2="17"/></svg>',
    save:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
    copy:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    check:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
  };

  // --- copy text to clipboard (with fallback) ---
  function legacyCopy(text){
    return new Promise(function(resolve, reject){
      try{
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error("copy failed"));
      } catch(e){ reject(e); }
    });
  }

  function copyText(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      // fall back to execCommand if the async API rejects (e.g. no focus/permission)
      return navigator.clipboard.writeText(text).catch(function(){ return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

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

  // --- generate a QR code for the current page URL and download it ---
  function downloadQR(c){
    if(typeof QRCode === "undefined"){
      // QR library failed to load — fall back to opening the print dialog isn't
      // appropriate; just send the user to the on-site QR generator.
      window.open("/qr", "_blank", "noopener");
      return;
    }
    var text = window.location.href;
    var holder = document.createElement("div");
    holder.style.display = "none";
    document.body.appendChild(holder);
    new QRCode(holder, {
      text: text,
      width: 512,
      height: 512,
      correctLevel: QRCode.CorrectLevel.H
    });
    // qrcodejs renders a <canvas> (with an <img> fallback); grab whichever exists
    setTimeout(function(){
      var canvas = holder.querySelector("canvas");
      var img = holder.querySelector("img");
      var dataUrl = canvas ? canvas.toDataURL("image/png") : (img ? img.src : null);
      if(dataUrl){
        var a = document.createElement("a");
        a.href = dataUrl;
        a.download = c.name.replace(/\s+/g,"_") + "_QR.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      document.body.removeChild(holder);
    }, 80);
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
    html += '<div class="nc-card">';
    html +=   '<img class="nc-photo" src="' + esc(c.photo) + '" alt="' + esc(c.name) + '">';
    html +=   '<h1 class="nc-name">' + esc(c.name) + '</h1>';
    // subtitle = "Title | Org" (either part optional)
    var subtitle = [c.title, c.org].filter(Boolean).join(" | ");
    if(subtitle) html += '<p class="nc-title">' + esc(subtitle) + '</p>';
    html +=   '<div class="nc-actions' + (subtitle ? '' : ' nc-actions--top') + '">';
    if(c.phone)    html += '<div class="nc-call-row">' +
                              '<a class="nc-btn nc-btn--primary" href="tel:' + esc(c.phone) + '">' + icons.phone + 'Phone</a>' +
                              '<button type="button" class="nc-btn nc-btn--icon" id="nc-copy" aria-label="Copy phone number" title="Copy number">' + icons.copy + '</button>' +
                            '</div>';
    if(c.email)    html += '<a class="nc-btn" href="mailto:' + esc(c.email) + '">' + icons.email + 'Email</a>';
    if(c.linkedin) html += '<a class="nc-btn" href="' + esc(c.linkedin) + '" target="_blank" rel="noopener">' + icons.linkedin + 'LinkedIn</a>';
    if(c.instagram) html += '<a class="nc-btn" href="' + esc(c.instagram) + '" target="_blank" rel="noopener">' + icons.instagram + 'Instagram</a>';
    html +=     '<button type="button" class="nc-btn nc-btn--accent" id="nc-save">' + icons.save + 'Save Contact</button>';
    html +=   '</div>';
    html += '</div>';
    // QR lives outside the card frame so it reads as a lighter, secondary action
    html += '<div class="nc-foot">';
    html +=   '<button type="button" class="nc-qr-link" id="nc-qr">' + icons.qr + 'Download QR</button>';
    html += '</div>';

    mount.innerHTML = html;

    var saveBtn = document.getElementById("nc-save");
    if(saveBtn) saveBtn.addEventListener("click", function(){ downloadVCard(c); });

    var qrBtn = document.getElementById("nc-qr");
    if(qrBtn) qrBtn.addEventListener("click", function(){ downloadQR(c); });

    var copyBtn = document.getElementById("nc-copy");
    if(copyBtn){
      copyBtn.addEventListener("click", function(){
        copyText(c.phone).then(function(){
          copyBtn.classList.add("is-copied");
          copyBtn.innerHTML = icons.check;
          copyBtn.title = "Copied!";
          clearTimeout(copyBtn._t);
          copyBtn._t = setTimeout(function(){
            copyBtn.classList.remove("is-copied");
            copyBtn.innerHTML = icons.copy;
            copyBtn.title = "Copy number";
          }, 1600);
        });
      });
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }

})();
