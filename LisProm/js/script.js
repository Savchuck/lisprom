let block_catalog = document.querySelector(".block-catalog");

catalog=[ 
    'Рейка',
    'Брус',
    'Дошка обрізна',
    'Дошка необрізна',
    'Вагонка сосна',
    'Дошка підлоги шпунтована',
    'Дошка терасна',
    'Фальшбрус'
];
for(i=0;i<catalog.length;i++){
    let catalog_items = document.createElement("div");
    catalog_items.classList.add("catalog-items");
    catalog_items.innerHTML = `
        <div class="cat-item">
            <h2>` + catalog[i]+ `</h2>
            <p>Відкрити категорію 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
            </svg>
            </p>
        </div>
    `;

    block_catalog.appendChild(catalog_items);
}

