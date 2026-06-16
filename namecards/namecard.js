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
    behance:'<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M9.07 6.5c.68 0 1.3.06 1.86.18.56.11 1.03.3 1.43.56.39.26.7.61.91 1.05.21.44.32.99.32 1.64 0 .71-.16 1.3-.48 1.77-.32.47-.8.86-1.43 1.15.86.25 1.5.68 1.93 1.31.43.62.64 1.37.64 2.25 0 .71-.14 1.32-.41 1.84-.27.51-.65.93-1.11 1.26-.47.33-1 .57-1.61.72-.6.16-1.22.23-1.85.23H2V6.5h7.07zm-.42 4.83c.56 0 1.02-.13 1.38-.4.36-.27.53-.7.53-1.3 0-.33-.06-.6-.18-.82-.12-.21-.28-.37-.49-.49-.2-.11-.44-.19-.71-.23-.27-.05-.55-.07-.84-.07H5.13v3.31h3.52zm.19 5.07c.31 0 .61-.03.89-.09.28-.06.53-.16.74-.3.21-.14.38-.33.5-.57.12-.24.18-.55.18-.92 0-.73-.21-1.25-.62-1.57-.41-.31-.96-.47-1.64-.47H5.13v3.92h3.71zM16.6 16.4c.37.36.9.54 1.6.54.5 0 .94-.13 1.3-.38.36-.25.58-.52.66-.8h2.21c-.35 1.1-.9 1.88-1.63 2.36-.73.47-1.62.71-2.66.71-.72 0-1.38-.12-1.96-.35-.58-.23-1.07-.56-1.48-.98-.4-.42-.72-.93-.94-1.51-.22-.59-.33-1.23-.33-1.94 0-.68.11-1.31.34-1.9.23-.59.55-1.1.96-1.53.42-.43.91-.77 1.49-1.01.57-.24 1.21-.37 1.91-.37.78 0 1.46.15 2.04.46.58.3 1.06.71 1.43 1.22.37.51.64 1.1.8 1.75.16.66.22 1.34.17 2.06h-6.41c0 .72.24 1.21.61 1.59zM19.7 11.7c-.3-.32-.74-.49-1.34-.49-.39 0-.72.07-.98.2-.26.13-.47.3-.63.49-.16.2-.27.41-.33.63-.06.22-.1.42-.11.6h3.97c-.06-.62-.27-1.1-.58-1.43zM15.1 7.4h4.97v1.21H15.1V7.4z"/></svg>',
    qr:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><line x1="14" y1="14" x2="14" y2="17"/><line x1="14" y1="21" x2="17" y2="21"/><line x1="21" y1="14" x2="21" y2="21"/><line x1="17" y1="17" x2="21" y2="17"/></svg>',
    download:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
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
    if(c.instagram) lines.push("URL:" + c.instagram);
    if(c.behance) lines.push("URL:" + c.behance);
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

  // --- generate a QR code (PNG data URL) for the current page URL ---
  // Cached after the first call so Show/Download reuse the same image.
  var _qrDataUrl = null;
  function getQRDataUrl(cb){
    if(_qrDataUrl){ cb(_qrDataUrl); return; }
    if(typeof QRCode === "undefined"){ cb(null); return; }
    var holder = document.createElement("div");
    holder.style.display = "none";
    document.body.appendChild(holder);
    new QRCode(holder, {
      text: window.location.href,
      width: 512,
      height: 512,
      correctLevel: QRCode.CorrectLevel.H
    });
    // qrcodejs renders a <canvas> (with an <img> fallback); grab whichever exists
    setTimeout(function(){
      var canvas = holder.querySelector("canvas");
      var img = holder.querySelector("img");
      _qrDataUrl = canvas ? canvas.toDataURL("image/png") : (img ? img.src : null);
      document.body.removeChild(holder);
      cb(_qrDataUrl);
    }, 80);
  }

  // --- download the QR code as a PNG ---
  function downloadQR(c){
    getQRDataUrl(function(dataUrl){
      if(!dataUrl){ window.open("/qr", "_blank", "noopener"); return; }
      var a = document.createElement("a");
      a.href = dataUrl;
      a.download = c.name.replace(/\s+/g,"_") + "_QR.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
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
    if(c.behance) html += '<a class="nc-btn" href="' + esc(c.behance) + '" target="_blank" rel="noopener">' + icons.behance + 'Behance</a>';
    html +=     '<button type="button" class="nc-btn nc-btn--accent" id="nc-save">' + icons.save + 'Save Contact</button>';
    html +=   '</div>';
    html += '</div>';
    // QR lives outside the card frame so it reads as a lighter, secondary action
    html += '<div class="nc-foot">';
    html +=   '<button type="button" class="nc-qr-link" id="nc-qr-toggle" aria-expanded="false" aria-controls="nc-qr-panel">' + icons.qr + 'Show QR</button>';
    html +=   '<div class="nc-qr-panel" id="nc-qr-panel" hidden></div>';
    html +=   '<button type="button" class="nc-qr-link nc-qr-download" id="nc-qr" hidden>' + icons.download + 'Download QR</button>';
    html += '</div>';

    mount.innerHTML = html;

    var saveBtn = document.getElementById("nc-save");
    if(saveBtn) saveBtn.addEventListener("click", function(){ downloadVCard(c); });

    var qrBtn = document.getElementById("nc-qr");
    if(qrBtn) qrBtn.addEventListener("click", function(){ downloadQR(c); });

    var qrToggle = document.getElementById("nc-qr-toggle");
    var qrPanel = document.getElementById("nc-qr-panel");
    if(qrToggle && qrPanel){
      qrToggle.addEventListener("click", function(){
        var showing = !qrPanel.hasAttribute("hidden");
        if(showing){
          qrPanel.setAttribute("hidden", "");
          if(qrBtn) qrBtn.setAttribute("hidden", "");
          qrToggle.setAttribute("aria-expanded", "false");
          qrToggle.innerHTML = icons.qr + "Show QR";
          return;
        }
        // build the QR image once, then reveal the panel
        if(!qrPanel.firstChild){
          getQRDataUrl(function(dataUrl){
            if(!dataUrl){ window.open("/qr", "_blank", "noopener"); return; }
            var img = document.createElement("img");
            img.src = dataUrl;
            img.alt = "QR code linking to " + c.name + "'s name card";
            img.className = "nc-qr-img";
            qrPanel.appendChild(img);
          });
        }
        qrPanel.removeAttribute("hidden");
        if(qrBtn) qrBtn.removeAttribute("hidden");
        qrToggle.setAttribute("aria-expanded", "true");
        qrToggle.innerHTML = icons.qr + "Hide QR";
      });
    }

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
