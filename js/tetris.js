var width = 10; //Chiều ngang bàn chơi
var height = 20; // Chiều cao bàn chơi
var tid; // Set interval
var disablemakeblock = 0; // Biến bật tắt tạo gạch 0: có thể tạo, 1: không thể tạo
var startnewblock = false; // Bắt đầu 1 viên gạch mới
var song;

function createboard() { // Tạo bàn chơi
    var i;
    var j;
    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            document.write("<img src='img/bgblock.jpg'>");
        }
        document.write("<pre></pre>");
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
            song.pause();
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
        for (i = 0; i <= 3; i++) { // Xóa gạch ở vị trí hiện tại và lưu thông số hiện tại
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
            for (i = 0; i <= 3; i++) {// Set màu tại vị trí mới và gán lại imagenumber,col cho thông số hiện tại
                document.images[newcurrent[i]].src = currenttype;
                current[i][0] = newcurrent[i];
                current[i][1] = current[i][1] + dir;
            }

            currentorigin[0] = currentorigin[0] + dir; // Set lại tọa độ x cho vị trí hiện tại
            checkhitdown(); // Kiểm tra xem gạch tiếp xúc
        }
        else {// Nếu ở cạnh trái hoặc cạnh phải trở lại vị trí hiện tại
            for (i = 0; i <= 3; i++) {
                document.images[saved[i]].src = currenttype;
            }
        }
    }
}

function rotate() { // Xoay gạch
    var block = currenttype;
    var savedorientation = currentorientation; // Sao lưu vị trí xoay hiện tại

    currentorientation = (currentorientation + 1) % 4; //Xoay theo thứ tự,nếu vị trí xoay tại 3 trở về 0.
    var i;
    var typeblock = blockrolate[currentorientation][currenttypenum]; // Lưu gạch[vị trí xoay][loạigạch]
    var atcol = currentorigin[0]; // Lưu tọa độ x hiện tại
    var atrow = currentorigin[1]; // Lưu tọa độ y hiện tại
    var atc;
    var atr;
    var imglink;
    var newcurrent = Array(); // mảng lưu imagenumber mới
    var saved = Array(); // mảng lưu imagenumber hiện tại
    var check = true;

    for (i = 0; i <= 3; i++) {
        atc = atcol + typeblock[i][0]; // Xét tọa độ x của 4 mặt tại vị trí mới
        if (atc >= (width)) { // Ngay cạnh phải, rời vòng lập
            check = false;
            break;
        }
        if (atc < 0) { // Ngay cạnh trái, rời vòng lập
            check = false;
            break;
        }
        atr = atrow + typeblock[i][1]; //Xét tọa độ y của 4 mặt tại vị trí mới
        if (atr >= (height)) {//Ngay cạnh đáy, rời vòng lập
            check = false;
            break;
        }
        newcurrent[i] = imagenumber(atc, atr);// Lưu lại imagenumber mới
    }
    if (check) {//Nếu không có lỗi
        for (i = 0; i <= 3; i++) {//Lưu vị imagenumber hiện tại và xóa vị trí cũ
            saved[i] = current[i][0];
            document.images[current[i][0]].src = "img/bgblock.jpg";
        }
        for (i = 0; i <= 3; i++) {//Kiểm tra từng ô gạch vị trí mới xem có trống không
            imglink = String(document.images[newcurrent[i]].src);
            found = imglink.search("img/bgblock.jpg");
            if (found == -1) {
                check = false;
                break;
            }
        }
        if (check) {// Nếu vị trí mới trống,di chuyển đến vị trí mới và lưu lại vị trí mới.
            for (i = 0; i <= 3; i++) {
                imagenum = newcurrent[i];
                document.images[imagenum].src = block;
                current[i][0] = imagenum;
                current[i][1] = atcol + typeblock[i][0];
                current[i][2] = atrow + typeblock[i][1];
            }
            checkhitdown(); // kiểm tra xem gạch tiếp xúc
        }
        else {// Nếu vị trí mới không trống, trở về vị trí cũ.
            for (i = 0; i <= 3; i++) { 
                document.images[saved[i]].src = block;
            }
            currentorientation = savedorientation;
        }
    }
    else { //Ngay cạnh trở về vị trí cũ
        currentorientation = savedorientation;
    }
}
function checkhitdown() { // Hàm kiểm tra lúc điểm tiếp xúc
    var i;
    var imglink;
    var check = true;
    var imgnum;
    var atcol;
    var atrow;
    var newcurrent = new Array(); // mảng lưu imagenumber mới.
    var saved = new Array(); // mảng lưu imagenumber hiện tại.
    var found;
    var hitdown = false;
    for (i = 0; i <= 3; i++) {
        imgnum = current[i][0];
        atcol = current[i][1];
        atrow = current[i][2];
        if (atrow >= (height - 1)) { // tại đáy bàn chơi
            hitdown = true;
            check = false;
            break;
        }
        newcurrent[i] = imagenumber(atcol, atrow + 1); // 
    }
    if (check) {
        for (i = 0; i <= 3; i++) { // xóa gạch ở vị trí hiện tại và lưu thông số hiện tại
            saved[i] = current[i][0];
            document.images[current[i][0]].src = "img/bgblock.jpg";
        } 
        for (i = 0; i <= 3; i++) {//Kiểm tra có trống nào chặn không
            imglink = String(document.images[newcurrent[i]].src);
            found = imglink.search("img/bgblock.jpg");
            if (found == -1) {// không tìm thấy
                check = false;
                hitdown = true;
                break;
            }
        }   
        for (i = 0; i <= 3; i++) {  //khôi phục khối trên các trường hợp trên.
            document.images[saved[i]].src = currenttype;
        }
    }
    startnewblock = true;// Cho phép bắt đầu gạch mới.
    disablemakeblock = 1; // Nhưng không tạo gạch mới
    return hitdown;
}

function movedown() { //Xuống 1 ô(row + 1)
    var i;
    var imglink;
    var check = true;
    var imgnum;
    var atcol;
    var atrow;
    var newcurrent = new Array();
    var saved = new Array();
    var found;
    var hitdown = false;
    for (i = 0; i <= 3; i++) {//Lưu vị trí mới (row + 1)
        imgnum = current[i][0];
        atcol = current[i][1];
        atrow = current[i][2];
        if (atrow >= (height - 1)) {//Nếu gặp cạnh đáy, thoát vòng lập
            hitdown = true;
            check = false;
            break;
        }
        newcurrent[i] = imagenumber(atcol, atrow + 1);//Lưu imagenumber tại vị trí (row+1)
    }
    if (check) {// Nếu không phải cạnh đáy
        for (i = 0; i <= 3; i++) {
            saved[i] = current[i][0];
            document.images[current[i][0]].src = "img/bgblock.jpg";
        }
        for (i = 0; i <= 3; i++) {
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
    if (hitdown) {//Không thể đi tiếp, chuẩn bị tạo gạch mới
        startnewblock = true;
        disablemakeblock = 0;
    }
    else {//Có thể đi tiếp
        checkhitdown();//Kiểm tra tiếp xúc
    }
}
function clock() {
    if (startnewblock) {
        if (disablemakeblock == 0) { //Tạo gạch mới
            startnewblock = false;
            completefalling();
            startnewpiece();
        }
        movedown();  //đưa viên gạch hiện tại xuống
    }
}

function completefalling() { //Kiểm tra hàng đầy đủ
    var i;
    var j;
    var imgnum;
    var boxcount;//Tính số ô trong 1 hàng
    var imglink;
    var found;
    var linesremoved = 0; //Tính số hàng đã xóa
    i = height - 1;//Kiểm tra từ dưới lên trên
    while (i >= 0) {//Bắt đầu vòng lập từ cạnh đáy
        boxcount = 0; //Khởi tạo ô = 0 cho mỗi hàng
        for (j = 0; j < width; j++) {
            imgnum = imagenumber(j, i);
            imglink = String(document.images[imgnum].src);
            found = imglink.search("img/bgblock.jpg");
            if (found == -1) { //Nếu không phải trống tăng số ô
                boxcount++;
            }
        }
        if (boxcount == width) { // Nếu số ô bằng số cột,tăng số hàng đã xóa, xóa dòng đó.
            linesremoved++;
            cutline(i);
            playcleansound("music/cleanmusic.mp3");
        }
        else {// Nếu số ô chưa đầy
            i--;
        }
    }
    if (linesremoved > 0) {//Nếu dòng đã xóa lớn hơn 0
        document.f.lines.value = linesremoved + parseInt(document.f.lines.value); // Cộng dòng đã xóa
        document.f.score.value = scoring[linesremoved - 1] + parseInt(document.f.score.value); //Cộng điểm 
    }
    if (document.f.lines.value >= 5)//Nếu số dòng đã xóa >= 5 chuyển sang level2
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

function cutline(cut) {//Xóa dòng tại vị trí cut
    var upper;
    var colindex;
    var imgnum;
    var imgnumb;
    for (upper = cut; upper > 0; upper--) {
        for (colindex = 0; colindex < width; colindex++) {
            imgnum = imagenumber(colindex, upper);
            imgnumb = imagenumber(colindex, upper - 1);
            document.images[imgnum].src = document.images[imgnumb].src;
        }
    }
}
function  detectbutton() {//Nhận diện phím nhập vào

    var key = event.keyCode;
    switch (key)
    {
        case 37: // Phím mũi tên trái 
            moveover(-1);
            break;
        case 39: // Phím mũi tên phải
            moveover(1);
            break;
        case 38: // Phím mũi tên lên
            rotate();
            break;
        case 40: // Phím mũi tên xuống
            movedown();
            break;
    }
}

function startnewpiece() { // Tạo 1 gạch mới
    var type = Math.floor(Math.random() * 7); //Random loại gạch từ 0 - 6
    makeblock(type);
}

function playbgsound(src) {//Chạy background music
    song = new Audio(src);
    song.loop = true;
    song.autoplay = true;
}
function playcleansound(src) {//Chạy music khi 1 dòng bị xóa
    var song = new Audio(src);
    song.autoplay = true;
}
function startgame() {//Hàm bắt đầu game
    clearInterval(tid);// Xóa thời gian thực thi hàm
    clearboard();// Làm sạch bàn chơi
    playbgsound("music/gamemusic.mp3");//Chạy background music
    document.f.lines.value = "0";
    document.f.score.value = "0";
    document.f.level.value = "1";
    startnewblock = true; // Bắt đầu viên gạch mới
    disablemakeblock = 0; // 
    tid = setInterval("clock();", 600); // Thiết lập game
    document.onkeydown = detectbutton; // Nhận diện phím nhập vào
}