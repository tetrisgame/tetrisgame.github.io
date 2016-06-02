
var width = 9;
var height = 19;
var tid;
var grace = 0;
var startnewone = false;
var graceperiod = 3;

function createboard() { // Tạo bàn chơi
    var i;
    var j;
    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            document.write("<img src='img/bgblock.jpg'>");
        }
        document.write("<pre></pre >");
    }
}
function clearboard() { // Clean bàn chơi
    for (var i = 0; i < height; i++)
    {
        clean(i);
    }
}
function clean(height) { // clean hàng 
    var x;
    var y;
    var imgcurrent;
    var imagedefault = "img/bgblock.jpg";
    for (x = height; x >= 0; x--) {
        for (y = 0; y < width; y++) {
            imgcurrent = imagenumber(y, x);
            document.images[imgcurrent].src = imagedefault;
        }
    }
}
var blocktypes = [//loại gạch
    [[0, 0], [1, 0], [2, 0], [1, 1]], // gạch chữ T
    [[0, 0], [1, 0], [2, 0], [3, 0]], // gạch thẳng
    [[0, 1], [1, 1], [1, 0], [2, 0]], // gạch chữ z ngược
    [[0, 0], [1, 0], [0, 1], [1, 1]], // gạch ô vuông
    [[0, 0], [1, 0], [1, 1], [2, 1]], // gạch chữ z
    [[0, 0], [1, 0], [2, 0], [2, 1]], // gạch chữ L
    [[0, 1], [1, 1], [2, 1], [2, 0]] // gạch chữ L ngược
];


var blockrolate = [// Chiều gạch
    [
        [[0, 0], [1, 0], [2, 0], [1, 1]], 
        [[0, 0], [1, 0], [2, 0], [3, 0]], 
        [[0, 1], [1, 1], [1, 0], [2, 0]], 
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[0, 0], [1, 0], [2, 0], [2, 1]],
        [[0, 1], [1, 1], [2, 1], [2, 0]]
    ],
    [
        [[1, 0], [1, 1], [1, 2], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [1, 3]],
        [[1, 2], [1, 1], [0, 1], [0, 0]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[1, 0], [1, 1], [0, 1], [0, 2]],
        [[1, 2], [1, 1], [1, 0], [2, 0]],
        [[2, 2], [2, 1], [2, 0], [1, 0]]
    ],
    [
        [[0, 1], [1, 1], [2, 1], [1, 0]],
        [[0, 0], [1, 0], [2, 0], [3, 0]],
        [[2, 0], [1, 0], [1, 1], [0, 1]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[2, 1], [1, 1], [0, 1], [0, 0]],
        [[2, 0], [1, 0], [0, 0], [0, 1]]
    ],
    [
        [[1, 0], [1, 1], [1, 2], [0, 1]],
        [[1, 0], [1, 1], [1, 2], [1, 3]],
        [[1, 2], [1, 1], [0, 1], [0, 0]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[1, 0], [1, 1], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2], [0, 2]],
        [[1, 0], [1, 1], [1, 2], [2, 2]]	
    ]
];
var scoring = [1, 4, 8, 16]; //điểm cấp số nhân
var blockimages = [// màu gạch
    "img/blue.png",
    "img/green.png",
    "img/highblue.png",
    "img/pink.png",
    "img/red.png",
    "img/yellow.png",
    "img/purple.png"
];
var current = [// Thông số gạch hiện tại imagenumber,col,row
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
var currenttype; //Loại màu gạch hiện tại
var currenttypenum; // Số loại từ 0 đến 6
var currentorientation; // Số loại quay từ 0 đến 3
var currentorigin; // vị trí hiện tại [x,y]

function imagenumber(atcol, atrow) { // xác định vị trí ảnh theo chiều ngang và chiều cao
    var imagenum = atrow * width + atcol;
    return imagenum;
}


function makeblock(type) { // Tạo gạch với type loại gạch từ 0 đến 6
    var imglink; // đường dẫn đến file ảnh
    var found;
    currentorigin = [3, 0]; // vị trí bắt đầu [3,0]
    currenttypenum = type; // đặt số loại = type
    currenttype = blockimages[type];  // màu gạch tại vị trí type
    var x = Math.floor((Math.random() * 4)); // Random từ 0 đến 3 để xác định chiều gạch
    currentorientation = x; // Đặt chiều gạch = x
    var i;
    var block = blockimages[type];
    var typeblock = blocktypes[type];
    var imagenum;
    var atcol;
    var atrow;
    for (i = 0; i <= 3; i++) {
        atcol = 3 + typeblock[i][0]; //Dời cột vào 3
        atrow = typeblock[i][1];
        imagenum = imagenumber(atcol, atrow);
        //Kiểm tra vị trí tiếp theo có trống không
        imglink = String(document.images[imagenum].src);
        found = imglink.search("img/bgblock.jpg"); //Nếu imglink trùng "img/bgblock.jpg" found >= 0, còn nếu không trùng found < 0
        if (found >= 0) { // Trống tạo gạch
            document.images[imagenum].src = block; // Đổi ảnh tại vị trí imagenum 
            current[i][0] = imagenum; // set thông số gạch hiện tại
            current[i][1] = atcol;
            current[i][2] = atrow;
        }
        else { // Không trống thua game
            alert("GAME OVER!");
            clearInterval(tid);
            document.onkeydown = 0;
            break;
        }
    }
}

function moveover(dir) { // moveover(1) sang phải, moveover(-1) sang trái.
    var i;
    var imglink;
    var check = true; // Kiểm tra nếu gặp lỗi
    var imgnum;
    var newcurrent = new Array(); // mảng lưu imagenumber mới
    var saved = new Array(); // mảng lưu imagenumber hiện tại
    for (i = 0; i <= 3; i++) { // đọc thông số gạch hiện tại
        imgnum = current[i][0];

        if (dir == -1) { // Di chuyển sang trái
            if (0 == imgnum % width) // Nếu gặp cạnh trái thì kết thúc
            {
                check = false;
                break;
            }
        }
        if (dir == 1) {// Di chuyển qua phải
            if ((width - 1) == imgnum % width) { // Nếu gặp cạnh phải thì kết thúc
                check = false;
                break;
            }
        }
        newcurrent[i] = imgnum + dir; // Lưu vị trí mới
    }

    if (check) { // Nếu kiểm tra không gặp lỗi
        for (i = 0; i <= 3; i++) { // Xóa gạch ở vị trí hiện tại và lưu vị trí hiện tại
            saved[i] = current[i][0];
            document.images[current[i][0]].src = "img/bgblock.jpg";
        }

        for (i = 0; i <= 3; i++) { // Kiểm tra coi gạch đã được xóa chưa
            imglink = String(document.images[newcurrent[i]].src);  
            found = imglink.search("img/bgblock.jpg");
            if (found == -1) {
                check = false;
                break;
            }
        }

        if (check) { 
            for (i = 0; i <= 3; i++) {
                document.images[newcurrent[i]].src = currenttype;
                current[i][0] = newcurrent[i];
                current[i][1] = current[i][1] + dir;
            }

            currentorigin[0] = currentorigin[0] + dir;
            checkifhitdown();
        }
        else {// Nếu ở cạnh trái hoặc cạnh phải trở lại vị trí hiện tại
            for (i = 0; i <= 3; i++) {
                document.images[saved[i]].src = currenttype;
            }
        }
    }
}

function rotate() {
    var block = currenttype;
    var savedorientation = currentorientation;

    currentorientation = (currentorientation + 1) % 4;
    var i;
    var typeblock = blockrolate[currentorientation][currenttypenum];
    var atcol = currentorigin[0];
    var atrow = currentorigin[1];
    var atc;
    var atr;
    var tests;
    var newcurrent = Array();
    var saved = Array();
    var oksofar = true;

    for (i = 0; i <= 3; i++) {
        atc = atcol + typeblock[i][0];
        if (atc >= (width - 1)) {
            oksofar = false;
            break;
        }
        if (atc < 0) {
            oksofar = false;
            break;
        }
        atr = atrow + typeblock[i][1];
        if (atr >= (height - 1)) {
            oksofar = false;
            break;
        }
        newcurrent[i] = imagenumber(atc, atr);
    }
    if (oksofar) {
        for (i = 0; i <= 3; i++) {
            saved[i] = current[i][0];
            document.images[current[i][0]].src = "img/bgblock.jpg"
        }
        for (i = 0; i <= 3; i++) {
            tests = String(document.images[newcurrent[i]].src);
            found = tests.search("img/bgblock.jpg");
            if (found == -1) {
                oksofar = false;
                break;
            }
        }
        if (oksofar) {
            for (i = 0; i <= 3; i++) {
                imagenum = newcurrent[i];
                document.images[imagenum].src = block;
                current[i][0] = imagenum;
                current[i][1] = atcol + typeblock[i][0];
                current[i][2] = atrow + typeblock[i][1];
            }
            checkifhitdown();
        }
        else {
            for (i = 0; i <= 3; i++) {
                document.images[saved[i]].src = block;
            }
            currentorientation = savedorientation;
        }
    }
    else {
        currentorientation = savedorientation;
    }
}
function checkifhitdown() {
    var i;
    var tests;
    var oksofar = true;
    var imgno;
    var atc;
    var atr;
    var newcurrent = new Array();
    var saved = new Array();
    var found;
    var hitdown = false;
    for (i = 0; i <= 3; i++) {
        imgno = current[i][0];
        atc = current[i][1];
        atr = current[i][2];
        if (atr >= (height - 1)) {
            hitdown = true;
            oksofar = false;
            break;
        }
        newcurrent[i] = imagenumber(atc, atr + 1);
    }
    if (oksofar) {
        for (i = 0; i <= 3; i++) {
            saved[i] = current[i][0];
            document.images[current[i][0]].src = "img/bgblock.jpg";
        } // ends for loop
        for (i = 0; i <= 3; i++) {
            tests = String(document.images[newcurrent[i]].src);
            found = tests.search("img/bgblock.jpg");
            if (found == -1) {
                oksofar = false;
                atc = currentorigin[1];
                hitdown = true;
                break;
            }
        }
        for (i = 0; i <= 3; i++) {
            document.images[saved[i]].src = currenttype;
        }
    }
    startnewone = true;
    grace = graceperiod;
    return hitdown;
}

function movedown() {
    var i;
    var tests;
    var oksofar = true;
    var imgno;
    var atc;
    var atr;
    var newcurrent = new Array();
    var saved = new Array();
    var found;
    var hitdown = false;
    for (i = 0; i <= 3; i++) {
        imgno = current[i][0];
        atc = current[i][1];
        atr = current[i][2];
        if (atr >= (height - 1)) {
            hitdown = true;
            oksofar = false;
            break;
        }
        newcurrent[i] = imagenumber(atc, atr + 1);
    }
    if (oksofar) {
        for (i = 0; i <= 3; i++) {
            saved[i] = current[i][0];
            document.images[current[i][0]].src = "img/bgblock.jpg";
        }
        for (i = 0; i <= 3; i++) {
            tests = String(document.images[newcurrent[i]].src);
            found = tests.search("img/bgblock.jpg");
            if (found == -1) {
                oksofar = false;
                break;
            }
        }
        if (oksofar) {
            for (i = 0; i <= 3; i++) {
                document.images[newcurrent[i]].src = currenttype;
                current[i][0] = newcurrent[i];
                current[i][2]++;
            } //ends for loop
            currentorigin[1]++;
        }
        else {
            for (i = 0; i <= 3; i++) {
                document.images[saved[i]].src = currenttype;
                hitdown = true;
            }
        }
    }
    if (hitdown) {
        startnewone = true;
        grace = 0;
    }
    else {
        if (checkifhitdown()) {
            startnewone = true;
            grace = graceperiod;
        }
    }
}
function clock() {
    if (startnewone) {
        if (grace == 0) {
            startnewone = false;
            completefalling();
            startnewpiece();
        }
        movedown();  //move current piece down
    }
}

function completefalling() {
    var i;
    var j;
    var imgno;
    var filledcount;
    var tests;
    var found;
    var linesremoved = 0;
    i = height - 1;
    while (i >= 0) {
        filledcount = 0;
        for (j = width - 1; j >= 0; j--) {
            imgno = imagenumber(j, i);
            tests = String(document.images[imgno].src);
            found = tests.search("img/bgblock.jpg");
            if (found == -1) {
                filledcount++;
            }
        }
        if (filledcount == width) {
            linesremoved++;
            cascade(i);
        }
        else {
            i--;
        }
    }
    if (linesremoved > 0) {
        document.f.lines.value = linesremoved + parseInt(document.f.lines.value);
        document.f.score.value = scoring[linesremoved - 1] + parseInt(document.f.score.value);
    }
    if (document.f.lines.value >= 5)
    {
        clearInterval(tid);
        tid = setInterval("clock();", 500);
        document.f.level.value = "2";
    }
    if (document.f.lines.value >= 10)
    {
        clearInterval(tid);
        tid = setInterval("clock();", 450);
        document.f.level.value = "3";
    }
    if (document.f.lines.value >= 15)
    {
        clearInterval(tid);
        tid = setInterval("clock();", 400);
        document.f.level.value = "4";
    }
    if (document.f.lines.value >= 20)
    {
        clearInterval(tid);
        tid = setInterval("clock();", 350);
        document.f.level.value = "5";
    }
    if (document.f.lines.value >= 25)
    {
        clearInterval(tid);
        tid = setInterval("clock();", 300);
        document.f.level.value = "6";
    }
    if (document.f.lines.value >= 30)
    {
        clearInterval(tid);
        tid = setInterval("clock();", 250);
        document.f.level.value = "7";
    }
    if (document.f.lines.value >= 35)
    {
        clearInterval(tid);
        tid = setInterval("clock();", 200);
        document.f.level.value = "8";
    }
    if (document.f.lines.value >= 40)
    {
        clearInterval(tid);
        tid = setInterval("clock();", 150);
        document.f.level.value = "9";
    }
    if (document.f.lines.value >= 45)
    {
        clearInterval(tid);
        tid = setInterval("clock();", 100);
        document.f.level.value = "10";
    }
}

function cascade(cut) {
    var upper;
    var colindex;
    var imgno;
    var imgnox;
    for (upper = cut; upper > 0; upper--) {
        for (colindex = 0; colindex < width; colindex++) {
            imgno = imagenumber(colindex, upper);
            imgnox = imagenumber(colindex, upper - 1);
            document.images[imgno].src = document.images[imgnox].src;
        }
    }
}
function  detectbutton() {

    var key = event.keyCode;
    switch (key)
    {
        case 37:
            moveover(-1);
            break;
        case 39:
            moveover(1);
            break;
        case 38:
            rotate();
            break;
        case 40:
            movedown();
            break;
    }
}

function startnewpiece() {
    var type = Math.floor(Math.random() * 7);
    makeblock(type);
}
function startgame() {
    clearInterval(tid);
    clearboard();
    document.f.lines.value = "0";
    document.f.score.value = "0";
    document.f.level.value = "1";
    startnewone = true;
    tid = setInterval("clock();", 600);
    document.onkeydown = detectbutton;
}