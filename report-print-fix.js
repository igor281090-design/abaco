// Ajustes finais de paginação: esta camada é carregada após o relatório e o ábaco.
const reportBeforePrintFix=report;
function traceabilityRows(items){
  return items.filter(([,value])=>value&&value!=="—").map(([label,value])=>`<div class="trace-row"><span>${esc(label)}</span><b>${esc(value)}</b></div>`).join("");
}
function traceabilitySection(test){
  const period=test.test_date_end&&test.test_date_end!==test.test_date?`${date(test.test_date)} a ${date(test.test_date_end)}`:date(test.test_date);
  const validity=test.calibration_validity_at?date(test.calibration_validity_at):(test.calibration_validity_months?`${test.calibration_validity_months} meses`:"");
  return `<section class="traceability-section"><h2>1 · Dados gerais e rastreabilidade</h2><div class="trace-grid"><article class="trace-card"><h3>Obra &amp; Contratante</h3>${traceabilityRows([["Contratante",test.client_name],["CPF/CNPJ",test.client_document],["Identificação da obra",test.site_name],["Endereço",test.site_address],[test.test_date_end&&test.test_date_end!==test.test_date?"Período de execução":"Data do ensaio",period]])}</article><article class="trace-card"><h3>Rastreabilidade do Instrumento</h3>${traceabilityRows([["Esclerômetro / tipo",`Tipo ${test.hammer_type||"N"}`],["Fabricante / modelo",test.manufacturer_model],["Nº de série",test.serial_number],["Certificado de calibração",test.calibration_certificate],["Laboratório",test.calibration_lab],["Última calibração",date(test.last_calibration_at)],["Validade da calibração",validity]])}</article><article class="trace-card"><h3>Execução Técnica</h3>${traceabilityRows([["Empresa executora",test.company],["Responsável técnico",test.responsible_name],["CREA / CAU",test.responsible_crea]])}</article><article class="trace-card art-trace-card">${test.art_number?`<h3>Anotação de Responsabilidade Técnica</h3>${traceabilityRows([["Nº da ART",test.art_number]])}`:""}</article></div></section>`;
}
report=function(test){
  let html=reportBeforePrintFix(test);
  html=html.replace(/<main><header>([\s\S]*?)<\/header><div class="kpis">([\s\S]*?)<\/div><\/div><section>/,(_,headerContent,kpiContent)=>{
    const compactHeader=headerContent.replace(/<p>[\s\S]*?<\/p>/,"");
    return `<main><header class="compact-cover"><div class="compact-identity">${compactHeader}</div><div class="kpis compact-kpis">${kpiContent}</div></div></header><section>`;
  });
  html=html.replace(/<table><tr>(<th>Zona<\/th>[\s\S]*?<th>Status<\/th>)<\/tr>([\s\S]*?)<\/table><\/section>/,(_,head,body)=>{
    return `<table class="summary-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></section>`;
  });
  html=html.replace(/<section><h2>1 · Dados gerais e rastreabilidade<\/h2><div class="two">[\s\S]*?<\/div><\/section><section><h2>2 · Resultados por zona<\/h2>/,`${traceabilitySection(test)}<section><h2>2 · Resultados por zona</h2>`);
  const css=`<style>
    .compact-cover{padding:15px 18px!important;display:flex;align-items:center;justify-content:space-between;gap:24px}
    .compact-identity{min-width:0;flex:1}
    .compact-cover .compact-identity small{font-size:7px}
    .compact-cover .compact-identity h1{margin:7px 0 0;font-size:23px;line-height:1.08}
    .compact-kpis{flex:0 0 auto;min-width:255px;margin:0!important;border:1px solid rgba(255,255,255,.2)!important;background:rgba(255,255,255,.06);border-radius:6px;overflow:hidden}
    .compact-kpis div{min-width:78px;padding:9px 12px!important;color:#a9c3c9!important;border-color:rgba(255,255,255,.18)!important;font-size:7px;text-transform:uppercase}
    .compact-kpis b{margin-top:2px;color:#fff!important;font-size:15px!important}
    .trace-grid{display:grid;grid-template-columns:1fr 1fr;column-gap:18px;row-gap:10px}
    .trace-card{min-width:0;padding:0 8px}
    .trace-card h3{margin:0 0 7px;color:#0f5669;font-size:9px;line-height:1.25;text-transform:uppercase;letter-spacing:.08em}
    .trace-row{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:4px 0;border-bottom:1px solid #e1e8e9}
    .trace-row span{flex:0 0 auto;color:#78888d;font-size:8px}
    .trace-row b{text-align:right;font-size:8px;overflow-wrap:anywhere}
    .art-trace-card:empty{min-height:24px}
    .traceability-section,.trace-grid,.trace-card{break-inside:avoid;page-break-inside:avoid}
    footer{position:static!important;inset:auto!important;width:auto!important;height:auto!important;margin:28px 0 0;padding:12px 30px;break-inside:avoid;page-break-inside:avoid}
    .summary-table thead{display:table-header-group}
    .summary-table tbody{display:table-row-group}
    .summary-table tr{break-inside:avoid;page-break-inside:avoid}
    @page{size:A4;margin:8mm 7mm 10mm}
    @media print{
      .compact-cover{padding:11px 15px!important}
      .compact-cover .compact-identity h1{font-size:21px}
      .compact-kpis{min-width:238px}
      .compact-kpis div{padding:7px 10px!important}
      .trace-grid{column-gap:14px;row-gap:8px}
      .trace-card{padding:0 6px}
      .trace-row{padding:3px 0}
      footer{position:static!important;inset:auto!important;width:auto!important;height:auto!important;margin:10mm -7mm -10mm;padding:4mm 7mm!important}
      .note{break-inside:auto!important;page-break-inside:auto!important;padding:8px!important;orphans:2;widows:2}
      section[style*="break-before:page"]{break-before:auto!important;page-break-before:auto!important;break-inside:auto!important;page-break-inside:auto!important}
      section[style*="break-before:page"] svg{break-inside:avoid;page-break-inside:avoid}
      section[style*="break-before:page"] table{break-inside:auto;page-break-inside:auto}
      h2{break-after:avoid;page-break-after:avoid}
      .rz,.two,.sign,tr{break-inside:avoid;page-break-inside:avoid}
      thead{display:table-header-group}
    }
  </style>`;
  return html.replace("</head>",`${css}</head>`);
};
