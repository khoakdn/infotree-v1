const svg = document.getElementById('tree');
const branchesGroup = document.getElementById('branches');
const nodesGroup = document.getElementById('nodes');
const projectBox = document.getElementById('projectBox');

const data = {
  company: { label: "PWMI" },
  partners: [
    { label: "Partner 1", branchColor: "#805E85", leafColor: "#805E85" },
    { label: "Partner 2", branchColor: "#F6A14E", leafColor: "#F6A14E" },
    { label: "Partner 4", branchColor: "#BE3E42", leafColor: "#BE3E42" },
    { label: "Partner 5", branchColor: "#BD596C", leafColor: "#BD596C" },
    { label: "Lumens", branchColor: "#5A7977", leafColor: "#5A7977" },
    { label: "T+Huis", branchColor: "#FA6532", leafColor: "#FA6532" },
    { label: "Partner 8", branchColor: "#564C90", leafColor: "#564C90" }
  ],
  projects: [
    { partner: "Partner 1", label: "Project A", details: "Details about Project A", link: "#", branchColor: "#A38CB0", leafColor: "#A38CB0" },
    { partner: "Partner 1", label: "Project B", details: "Details about Project B", link: "#", branchColor: "#A38CB0", leafColor: "#A38CB0" },
    { partner: "Partner 1", label: "Project C", details: "Details about Project C", link: "#", branchColor: "#A38CB0", leafColor: "#A38CB0" },
    { partner: "Partner 2", label: "Project A", details: "Details", link: "#", branchColor: "#F8C87F", leafColor: "#F8C87F" },
    { partner: "Partner 2", label: "Project B", details: "Details", link: "#", branchColor: "#F8C87F", leafColor: "#F8C87F" },
    { partner: "Partner 2", label: "Project C", details: "Details", link: "#", branchColor: "#F8C87F", leafColor: "#F8C87F" },
    { partner: "Partner 4", label: "Project A", details: "Details", link: "#", branchColor: "#FC958A", leafColor: "#FC958A" },
    { partner: "Partner 4", label: "Project B", details: "Details", link: "#", branchColor: "#FC958A", leafColor: "#FC958A" },
    { partner: "Partner 4", label: "Project C", details: "Details", link: "#", branchColor: "#FC958A", leafColor: "#FC958A" },
    { partner: "Partner 5", label: "Project A", details: "Details", link: "#", branchColor: "#C08995", leafColor: "#C08995" },
    { partner: "Partner 5", label: "Project B", details: "Details", link: "#", branchColor: "#C08995", leafColor: "#C08995" },
    { partner: "Partner 5", label: "Project C", details: "Details", link: "#", branchColor: "#C08995", leafColor: "#C08995" },
    { partner: "Lumens", label: "Project A", details: "Details", link: "#", branchColor: "#A0B1AB", leafColor: "#A0B1AB" },
    { partner: "Lumens", label: "Project B", details: "Details", link: "#", branchColor: "#A0B1AB", leafColor: "#A0B1AB" },
    { partner: "Lumens", label: "Project C", details: "Details", link: "#", branchColor: "#A0B1AB", leafColor: "#A0B1AB" },
    { partner: "T+Huis", label: "Club Van Gent", details: "Bruggenbouwer: Michel/ Aike Opdrachtgever: Bs. Fellenoord Planning: ddonderdag", link: "#", branchColor: "#F9A88B", leafColor: "#F9A88B" },
    { partner: "T+Huis", label: "Weerbaarheids Training Gr 7/8", details: "Details", link: "#", branchColor: "#F9A88B", leafColor: "#F9A88B" },
    { partner: "T+Huis", label: "Taalles In De Buurt", details: "Details", link: "#", branchColor: "#F9A88B", leafColor: "#F9A88B" },
    { partner: "Partner 8", label: "Project A", details: "Details", link: "#", branchColor: "#8687BC", leafColor: "#8687BC" },
    { partner: "Partner 8", label: "Project B", details: "Details", link: "#", branchColor: "#8687BC", leafColor: "#8687BC" },
    { partner: "Partner 8", label: "Project C", details: "Details", link: "#", branchColor: "#8687BC", leafColor: "#8687BC" }
  ]
};

const centerX = 250;
const centerY = 250;
let isZoomed = false;
let currentZoomTarget = null;

function createBranchPath(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const cx1 = x1 + dx * 0.3, cy1 = y1 + dy * 0.1;
  const cx2 = x1 + dx * 0.7, cy2 = y1 + dy * 0.9;
  return `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
}

function createLeaf(x, y, radius, label, zoomTarget, isCompany = false, isProject = false, projectData = {}, branchColor = null, leafColor = null) {
  const leaf = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  leaf.setAttribute("cx", x);
  leaf.setAttribute("cy", y);
  leaf.setAttribute("r", radius);
  leaf.setAttribute("class", "circle" + (isCompany ? " static" : ""));
  leaf.style.fill = leafColor || "#AED581";
  leaf.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomTo(zoomTarget, leaf);
    if (isProject) showProjectBox(leaf, projectData);
    else hideProjectBox();
  });
  nodesGroup.appendChild(leaf);

  const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  labelText.setAttribute("x", x);
  labelText.setAttribute("y", y + 1);
  labelText.style.fontSize = `${radius * 0.5}px`;
  labelText.textContent = label.length > 10 ? label.slice(0, 9) + '…' : label;
  nodesGroup.appendChild(labelText);
}

function zoomTo(target, element) {
  document.querySelectorAll('.circle').forEach(c => c.classList.remove('zoomed'));
  element.classList.add('zoomed');
  const svgBox = svg.viewBox.baseVal;
  const percentX = (target.x / svgBox.width) * 100;
  const percentY = (target.y / svgBox.height) * 100;
  if (!isZoomed || currentZoomTarget !== element) {
    svg.style.transformOrigin = `${percentX}% ${percentY}%`;
    svg.style.transform = 'scale(2)';
    isZoomed = true;
    currentZoomTarget = element;
  }
}

function showProjectBox(leafElement, projectData) {
  const rect = leafElement.getBoundingClientRect();
  projectBox.style.left = `${rect.left + rect.width / 2 - 120}px`;
  projectBox.style.top = `${rect.bottom + 12}px`;
  projectBox.innerHTML = `
    <div>
      <span class="close-btn" onclick="hideProjectBox()">×</span>
      <strong>${projectData.label}</strong>
      <p style="margin-top:8px;">${projectData.details.replace(/\n/g, '<br>')}</p>
      ${projectData.link ? `<a href="${projectData.link}" target="_blank" style="display:inline-block;margin-top:8px;background:#FA6532;color:white;padding:6px 12px;border-radius:6px;text-decoration:none;">See more</a>` : ""}
    </div>`;
  projectBox.style.display = 'block';
}

function hideProjectBox() {
  projectBox.style.display = 'none';
}

document.body.addEventListener('click', (e) => {
  if (isZoomed && !e.target.closest('circle')) {
    svg.style.transform = 'scale(1)';
    document.querySelectorAll('.circle').forEach(c => c.classList.remove('zoomed'));
    isZoomed = false;
    currentZoomTarget = null;
  }
  hideProjectBox();
});

function renderTree() {
  branchesGroup.innerHTML = '';
  nodesGroup.innerHTML = '';

  // Draw main company in center
  createLeaf(centerX, centerY, 50, data.company.label, { x: centerX, y: centerY }, true);

  const partnersRadius = 120;
  const partnerPositions = {};

  // Adjusted layout to keep trunk area clear
  const totalAngle = 2 * Math.PI;
  const gapAngle = Math.PI / 3; // 60° gap at the bottom
  const availableAngle = totalAngle - gapAngle;
  const startAngle = -Math.PI / 2 - availableAngle / 2;

  data.partners.forEach((p, i) => {
    const angle = startAngle + (availableAngle / (data.partners.length - 1)) * i;
    const x = centerX + partnersRadius * Math.cos(angle);
    const y = centerY + partnersRadius * Math.sin(angle);
    partnerPositions[p.label] = { x, y };

    // Branch to partner
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", createBranchPath(centerX, centerY, x, y));
    path.setAttribute("class", "branch");
    path.style.stroke = p.branchColor || "#444";
    branchesGroup.appendChild(path);

    // Partner leaf
    createLeaf(x, y, 40, p.label, { x, y }, false, false, {}, p.branchColor, p.leafColor);
  });

  const projectsRadius = 80;

  // Project layout
  data.partners.forEach((partner, i) => {
    const baseAngle = startAngle + (availableAngle / (data.partners.length - 1)) * i;
    const partnerPos = partnerPositions[partner.label];

    const relatedProjects = data.projects.filter(proj =>
      proj.partner === partner.label
    );
    const angleSpread = 1.2;
    const step = relatedProjects.length > 1 ? angleSpread / (relatedProjects.length - 1) : 0;
    const startSubAngle = baseAngle - angleSpread / 2;

    relatedProjects.forEach((p, j) => {
      const subAngle = startSubAngle + (step * j);
      const x = partnerPos.x + projectsRadius * Math.cos(subAngle);
      const y = partnerPos.y + projectsRadius * Math.sin(subAngle);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", createBranchPath(partnerPos.x, partnerPos.y, x, y));
      path.setAttribute("class", "branch");
      path.style.stroke = p.branchColor || "#444";
      branchesGroup.appendChild(path);

      createLeaf(x, y, 20, p.label, { x, y }, false, true, p, p.branchColor, p.leafColor);
    });
  });
}

renderTree();
