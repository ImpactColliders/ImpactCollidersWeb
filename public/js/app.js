async function claim(code){
  const r=await fetch('/api/claim-code.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});
  return r.json();
}
