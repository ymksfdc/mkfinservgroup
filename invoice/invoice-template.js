let services = [{ desc: '', amount: '' }];

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value || '' : '';
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function esc(value) {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function fmtDate(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${d}-${m}-${y}`;
}

function renderServicesList() {
  const el = document.getElementById('services-list');
  el.innerHTML = services.map((service, index) => `
    <div class="service-item">
      ${services.length > 1 ? `<button class="remove-svc" onclick="removeService(${index})" title="Remove">x</button>` : ''}
      <div class="field">
        <label>Service / Description</label>
        <input type="text" placeholder="e.g. ITR Filing" value="${esc(service.desc)}" oninput="updateService(${index}, 'desc', this.value)">
      </div>
      <div class="field">
        <label>Amount (INR)</label>
        <input type="number" min="0" placeholder="0.00" value="${esc(service.amount)}" oninput="updateService(${index}, 'amount', this.value)">
      </div>
    </div>
  `).join('');
}

function addService() {
  services.push({ desc: '', amount: '' });
  renderServicesList();
  render();
}

function removeService(index) {
  services.splice(index, 1);
  renderServicesList();
  render();
}

function updateService(index, key, value) {
  services[index][key] = value;
  render();
}

function render() {
  setHTML('p-cname', val('f-cname') || '<span style="color:#c0cdd8;font-style:italic;font-weight:400;">Client name</span>');
  setHTML('p-caddr', val('f-caddr') || '<span style="color:#c0cdd8;font-style:italic;">Address / contact</span>');

  setText('p-invno', val('f-invno') || '-');
  setText('p-invdate', fmtDate(val('f-invdate')) || '-');
  setText('p-paydate', fmtDate(val('f-paydate')) || '-');
  setText('p-paymode', val('f-paymode') || '-');

  const filled = services.filter((service) => service.desc || service.amount);
  if (!filled.length) {
    document.getElementById('p-items').innerHTML = `
      <tr>
        <td>1</td>
        <td style="color:#c0cdd8;font-style:italic;">No services added yet</td>
        <td style="text-align:right;color:#c0cdd8;">-</td>
      </tr>
    `;
  } else {
    document.getElementById('p-items').innerHTML = services.map((service, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${esc(service.desc) || '<span style="color:#c0cdd8;font-style:italic;">-</span>'}</td>
        <td style="text-align:right;">${service.amount ? 'Rs. ' + parseFloat(service.amount).toFixed(2) : '-'}</td>
      </tr>
    `).join('');
  }

  const total = services.reduce((sum, service) => sum + (parseFloat(service.amount) || 0), 0);
  setText('p-subtotal', 'Rs. ' + total.toFixed(2));
  setText('p-total', 'Rs. ' + total.toFixed(2));

  const remarks = val('f-remarks');
  const remarksEl = document.getElementById('p-remarks');
  remarksEl.textContent = remarks || 'No remarks added.';
  remarksEl.className = 'inv-remarks-text' + (remarks ? '' : ' inv-remarks-placeholder');
}

function resetForm() {
  ['f-invno', 'f-cname', 'f-caddr', 'f-remarks', 'f-paymode'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('f-invdate').value = today;
  document.getElementById('f-paydate').value = today;
  services = [{ desc: '', amount: '' }];
  renderServicesList();
  render();
}

async function waitForImages(root) {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(images.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  }));
}

function buildPrintHTML(invoiceHTML) {
  const baseStyle = (document.querySelector('style') || {}).textContent || '';
  const printStyle = [
    'html, body { background: #ffffff !important; }',
    'body { margin: 0; padding: 0; }',
    '.app-nav, .sidebar, .preview-label, #toast { display: none !important; }',
    '.workspace { display: block !important; height: auto !important; overflow: visible !important; }',
    '.preview-area { height: auto !important; overflow: visible !important; padding: 0 !important; }',
    '#invoice-paper { width: 190mm !important; max-width: 190mm !important; margin: 0 auto !important; border-radius: 0 !important; box-shadow: none !important; page-break-inside: avoid; }',
    '@page { size: A4 portrait; margin: 10mm; }'
  ].join('\n');

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>Mk FinServ Invoice</title>',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">',
    '<style>',
    baseStyle,
    printStyle,
    '</' + 'style>',
    '</head>',
    '<body>',
    invoiceHTML,
    '</body>',
    '</html>'
  ].join('\n');
}

async function generatePDF() {
  const toast = document.getElementById('toast');
  toast.textContent = 'Generating PDF...';
  toast.classList.add('show');

  try {
    const paper = document.getElementById('invoice-paper');
    const headerWebsiteEl = paper.querySelector('.inv-brand-text .sub');
    const footerWebsiteEl = paper.querySelector('.inv-footer-stamp');
    const paperRect = paper.getBoundingClientRect();
    const headerWebsiteRect = headerWebsiteEl ? headerWebsiteEl.getBoundingClientRect() : null;
    const footerWebsiteRect = footerWebsiteEl ? footerWebsiteEl.getBoundingClientRect() : null;
    await waitForImages(paper);

    const canvas = await html2canvas(paper, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const usableWidth = pageWidth - (margin * 2);
    const usableHeight = pageHeight - (margin * 2);
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let placedX = margin;
    let placedY = margin;
    let placedWidth = imgWidth;
    let placedHeight = imgHeight;

    if (imgHeight <= usableHeight) {
      pdf.addImage(imgData, 'PNG', placedX, placedY, placedWidth, placedHeight);
    } else {
      const fitWidth = (canvas.width * usableHeight) / canvas.height;
      placedX = (pageWidth - fitWidth) / 2;
      placedWidth = fitWidth;
      placedHeight = usableHeight;
      pdf.addImage(imgData, 'PNG', placedX, placedY, placedWidth, placedHeight);
    }

    if (paperRect.width && paperRect.height) {
      const scaleX = placedWidth / paperRect.width;
      const scaleY = placedHeight / paperRect.height;

      if (headerWebsiteRect) {
        const linkX = placedX + ((headerWebsiteRect.left - paperRect.left) * scaleX);
        const linkY = placedY + ((headerWebsiteRect.top - paperRect.top) * scaleY);
        const linkW = headerWebsiteRect.width * scaleX;
        const linkH = headerWebsiteRect.height * scaleY;
        pdf.link(linkX, linkY, linkW, linkH, { url: 'https://mkfinservgroup.com/' });
      }

      if (footerWebsiteRect) {
        const linkX = placedX + ((footerWebsiteRect.left - paperRect.left) * scaleX);
        const linkY = placedY + ((footerWebsiteRect.top - paperRect.top) * scaleY);
        const linkW = footerWebsiteRect.width * scaleX;
        const linkH = footerWebsiteRect.height * scaleY;
        pdf.link(linkX, linkY, linkW, linkH, { url: 'https://mkfinservgroup.com/' });
      }
    }

    const invNo = val('f-invno') || 'invoice';
    const cname = (val('f-cname') || 'client').replace(/\s+/g, '_');
    pdf.save(`MkFinServ_${invNo}_${cname}.pdf`);

    toast.textContent = 'PDF downloaded.';
    setTimeout(() => toast.classList.remove('show'), 2500);
  } catch (error) {
    toast.textContent = 'Error generating PDF. Try again.';
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

function init() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('f-invdate').value = today;
  document.getElementById('f-paydate').value = today;
  renderServicesList();
  render();
}

init();