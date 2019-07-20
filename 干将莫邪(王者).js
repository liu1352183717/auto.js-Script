const config = {
    position: {
        //四个技能的位置
        skill: [[1430, 951], [1467, 788], [1606, 660], [1781, 632]],
        //技能可以升级时的加号图标中心位置
        skill_upgrade: [[1341, 859], [1377, 693], [1517, 569], [1694, 539]],
        //方向盘位置
        steering: {
            //中心
            center: [277, 832],
            //半径
            radius: 150
        },
        //小地图中的水晶的位置
        base: [87, 260],
        //小地图中的泉水的位置，用于回城
        fountain: [26, 310],
        //闪现的位置
        flash: [1253, 924],
        //恢复的位置
        health: [1114, 960],
        //补兵键的位置
        hit: [1592, 977],
        //有装备时显示装备的位置
        equip: [208, 435],
        //小地图中自己的一塔位置，为了开局时可以过去清兵
        self_tower: [140, 200],
        //对方塔的警戒线，防止自己超过这个位置送塔
        //分别是一塔和水晶
        enemy_tower_line: [[192, 148], [233, 109]],
        //对方塔的位置
        enemy_tower: [220, 122],
        attack_head_start: [1319, 511],
        hp: [[879, 410], [879, 428]]
    },
    offset: {
        map: {
            self: [6, 5],
            enemy: [1, 24]
        },
        magic_to_hp: [0, 11]
    },
    distance: {
        //技能距离
        skill: [[], [22.5, 30], [34.5, 39.5], []]
    },
    //技能升级优先级
    upgrade_priority: [3, 2, 1, 0],
    images: {
        map: {
            //自己的小地图头像路径
            self: "./images/ganjiang.png"
        }
    },
    //大致血条长度
    hp_length: 184,
    color: {
        //血条最左边颜色
        hp_left: "#0C8F3C",
        //血条满血时中间颜色
        hp_middle: "#15a843",
        //蓝条最左边颜色
        magic_left: "#4CA6F1",
        //蓝条中间颜色
        magic_middle: "#2383DB",
        skill: ["#662B4D", "#8200B3", "#281E43", "#FADBC8"],
        //技能升级的加号的中间颜色
        upgrade: ["#21A5DE", "#21A5DE", "#21A5DE", "#EDC416"],
        attack_head_start: {
            high_hp: "#1F89B8",
            low_hp: "#B91816"
        },
        enemy_tower: "#D81617",
        creep: {
            self: "#21AE56",
            enemy: "#FE443B"
        }
    },
    rect: {
        topple_towers: [1709, 39, 23, 32]
    }
}

const selfInMap = images.read(config.images.map.self);
const base = {
    x: config.position.base[0],
    y: config.position.base[1]
};
const fountain = {
    x: config.position.fountain[0],
    y: config.position.fountain[1]
};


const skill2distance = 36.7;

//触发技能
function skill(i) {
    log("skill: ", i);
    press(config.position.skill[i][0], config.position.skill[i][1], 100);
    sleep(50);
}

//闪现
function flash() {
    var f = config.position.flash;
    //往左下角闪现
    swipe(f[0], f[1], f[0] - 200, f[1] + 200, 170);
}

//恢复
function heal() {
    press(config.position.health[0], config.position.health[1], 50);
}

//补兵
function hit() {
    press(config.position.hit[0], config.position.hit[1], 50);
}

//点击装备
function equip() {
    press(config.position.equip[0], config.position.equip[1], 50);
}

//升级技能（如果可以升级）
function upgrade(img) {
    for (var i = 0; i < config.upgrade_priority.length; i++) {
        var skill = config.upgrade_priority[i];
        var upgrade_pos = config.position.skill_upgrade[skill];
        if (images.detectsColor(img, config.color.upgrade[skill], upgrade_pos[0], upgrade_pos[1], 4, "rgb")) {
            press(upgrade_pos[0], upgrade_pos[1], 50);
            return true;
        }
    }
    return false;
}

function move(a, duration) {
    var center = config.position.steering.center;
    var radius = config.position.steering.radius;
    swipe(center[0], center[1], center[0] + radius * Math.cos(a),
        center[1] + radius * Math.sin(a), duration);
}

function findEnemyCreepInMap(img) {
    return findColor(img, config.color.creep.enemy, {
        region: [0, 0, 350, 350],
        threshold: 0
    });
}

function findSelfCreepInMap(img) {
    return findColor(img, config.color.creep.self, {
        region: [0, 0, 350, 350],
        threshold: 0
    });
}

function findEnemyInMap(img) {
    var pos = findMultiColors(img, "#D42021", [[1, 40, "#B41414"], [-19, 22, "#D61814"], [19, 23, "#D21815"]], {
        region: [0, 0, 350, 350],
        threshold: 16,
        algorithm: "rgb"
    });
    if (pos) {
        pos.x += config.offset.map.enemy[0];
        pos.y += config.offset.map.enemy[1];
    }
    return pos;
}

function findEnemyAttackHead(img) {
    var pos = config.position.attack_head_start;
    if (images.detectsColor(img, config.color.attack_head_start.high_hp, pos[0], pos[1], 4, "rgb")) {
        return "high_hp";
    }
    if (images.detectsColor(img, config.color.attack_head_start.low_hp, pos[0], pos[1], 4, "rgb")) {
        return "low_hp";
    }
    return null;
}

function findSelfInMap(img) {
    var pos = findImage(img, selfInMap, {
        region: [0, 0, 350, 350],
        threshold: 0.7
    });
    if (pos) {
        pos.x += config.offset.map.self[0];
        pos.y += config.offset.map.self[1];
    }
    return pos;
}

function findHpPercent(img) {
    var hpPos = config.position.hp;
    var hpLen = config.hp_length;
    var color = config.color.hp_middle;
    var hp = 0;
    var x = hpPos[0][0];
    var y = hpPos[0][1];
    for (var i = 0; i < hpPos.length; i++) {
        let xi = hpPos[i][0];
        let yi = hpPos[i][1];
        if (images.detectsColor(img, color, xi, yi, 32, "rgb")) {
            x = xi;
            y = yi;
            break;
        }
    }
    for (let i = 0; i < hpLen; i += 3) {
        if (images.detectsColor(img, color, x + i, y, 32, "rgb")) {
            hp = i + 1;
        }
    }
    return hp / hpLen;
}

function findMagicPercent(img) {
    var hpPos = config.position.hp;
    var offset = config.offset.magic_to_hp;
    var hpLen = config.hp_length;
    var color = config.color.magic_middle;
    var magic = 0;
    var x = hpPos[0][0] + offset[0];
    var y = hpPos[0][1] + offset[1];
    for (var i = 0; i < hpPos.length; i++) {
        let xi = hpPos[i][0] + offset[0];
        let yi = hpPos[i][1] + offset[1];
        if (images.detectsColor(img, color, xi, yi, 32, "rgb")) {
            x = xi;
            y = yi;
            break;
        }
    }
    for (let i = 0; i < hpLen; i += 3) {
        if (images.detectsColor(img, color, x + i, y, 32, "rgb")) {
            magic = i + 1;
        }
    }
    return magic / hpLen;
}

function findSkillStatus(img) {
    var status = [];
    for (var i = 0; i < config.position.skill.length; i++) {
        var pos = config.position.skill[i];
        if (images.detectsColor(img, config.color.skill[i], pos[0], pos[1], 4, "rgb")) {
            status.push(true);
        } else {
            status.push(false);
        }
    }
    return status;
}

function findSelfStatus(img) {
    var status = {};
    status.skill = findSkillStatus(img);
    status.hp = findHpPercent(img);
    status.magic = findMagicPercent(img);
    return status;
}

function recall() {
    while (true) {
        log("recall...");
        var img = captureScreen();
        var self = findSelfInMap(img);
        var enemyAttackHead = findEnemyAttackHead(img);
        var status = findSelfStatus(img);
        if(enemyAttackHead && status.hp < 0.1){
            flash();
        }
        if (self) {
            moveTo(self, fountain, 2000);
            if (distance(self, fountain) < 20) {
                sleep(1500);
                break;
            }
        } else {
            move(3 * Math.PI / 4, 800);
            move(Math.PI / 2, 800);
        }
        log("status = ", status);
        if (status) {
            if (status.hp > 0.35 && status.magic > 0.3) {
                break;
            }
        }
    }
}

function distance(p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

requestScreenCapture();
sleep(1000);

function moveTo(self, target, duration) {
    if (!target || !self || target.x == undefined|| target.y == undefined 
        || self.x == undefined || self.y == undefined) {
        throw new TypeError("self = " + self + ", target = " + target);
    }
    duration = duration || 400;
    var dx = target.x - self.x;
    var dy = target.y - self.y;
    var arg;
    if (dx == 0) {
        arg = Math.PI / 2;
    } else {
        arg = Math.atan(dy / dx);
    }
    if (dx < 0) {
        arg += Math.PI;
    }
    move(arg, 400);
}

function moveAway(self, target) {
    var dx = target.x - self.x;
    var dy = target.y - self.y;
    var arg = Math.atan(dy / dx);
    if (dx > 0) {
        arg += Math.PI;
    }
    move(arg, 400);
}

function moveToCreep(self, img) {
    //找兵线位置
    var creepPos = findEnemyCreepInMap(img);
    log("moveToCreep: creep = ", creepPos);
    if (creepPos) {
        moveTo(self, creepPos, 800);
        
        if (distance(self, creepPos) < 40) {
            skill(1);
            skill(2);
            hit();
        }
    } else {
        if (self && (self.x < config.position.self_tower[0] && self.y > config.position.self_tower[1])) {
            move(- Math.PI / 4, 700);
        } else {
            move(Math.random() * Math.PI * 2, 400);
            sleep(50);
            hit();
        }
    }
}


while (true) {
    var img = captureScreen();
    //检测是否需要升级技能
    upgrade(img);
    //检测是否需要装备
    equip();

    var status = findSelfStatus(img);
    var enemyAttackHead = findEnemyAttackHead(img);
    var self = findSelfInMap(img);
    log("enemyAttackHead = %s, status = ", enemyAttackHead, status);
    //检查自己状态
    //如果状态很差并且敌人在附近则闪现回城
    if (status.hp < 0.2 && enemyAttackHead) {
        //检测是否在水晶附近导致血条被挡住误判
        if (!self || distance(self, base) > 15) {
            //有一技能则一技能弹开
            if (status.skill[0]) {
                skill(0);
            }
            flash();
            heal();
            move(3 * Math.PI / 4, 3000);
            toastLog("回城: hp = " + status.hp + ", magic = " + status.magic);
            recall();
            continue;
        }
    } 
    if (status.hp < 0.2 || status.magic < 0.1 || (status.hp < 0.3 && status.magic < 0.2)) {
        //检测是否在水晶附近导致血条被挡住误判
        if (!self || distance(self, base) > 15) {
            toastLog("回城: hp = " + status.hp + ", magic = " + status.magic);
            recall();
            continue;
        }
    }
    //如果状态需要恢复则恢复
    if (status.hp < 0.7) {
        heal();
    }
    var enemy = findEnemyInMap(img);
    log("self = %s, enemy = %s", self, enemy);
    //找不到自己的头像
    if (!self) {
        //并且敌人的头像在附件，意味着敌人离自己很近把自己头像覆盖了
        if (enemyAttackHead) {
            log("move away from enemy");
            //有一技能则一技能弹开
            if (status.skill[0]) {
                skill(0);
            }
            move(3 * Math.PI / 4, 1000);
            continue;
        } else {
            //否则直接去找兵线
            move(3 * Math.PI / 4, 800);
            //moveToCreep(self, img);
            continue;
        }
    }
    var selfCreep = findSelfCreepInMap(img);
    log("selfCreep = ", selfCreep);
    var enemy_tower_line = config.position.enemy_tower_line[0].slice();
    if (selfCreep) {
        if(selfCreep.x - 80 > enemy_tower_line[0]){
            toastLog(selfCreep.x - 80);
        }
        if(selfCreep.y + 80 < enemy_tower_line[1]){
            toastLog(selfCreep.x - 80);
        }
    }
    //如果要跑到对方的塔里了则往回走
    if (self.x > enemy_tower_line[0] || self.y < enemy_tower_line[1]) {
        log("move away from enemy_tower");
        move(3 * Math.PI / 4, 1000);
        continue;
    }
    //如果找不到敌人位置
    if (!enemy) {
        //则找兵线吧
        moveToCreep(self, img);
        continue;
    }
    var d = distance(self, enemy);
    log("distance = ", d);
    //敌人距离在一技能攻击范围内
    if (status.skill[1] && d >= config.distance.skill[1][0] - 5 && d <= config.distance.skill[1][1] + 5) {
        //大招强化
        skill(1);
        skill(3);
        move(Math.random() * Math.PI * 2, 350);
        skill(1);
    }
    //敌人距离在二技能攻击范围内
    if (status.skill[2] && d >= config.distance.skill[2][0] + 5 && d <= config.distance.skill[2][1] + 5) {
        //大招强化
        skill(2);
        skill(3);
        move(Math.random() * Math.PI * 2, 350);
        skill(2);
    }
    //如果和敌人距离过远则向敌人移动
    if (d > config.distance.skill[1][1]) {
        moveTo(self, enemy);
    } else if (d < config.distance.skill[1][1]) {
        //如果和敌人距离过近则远离敌人
        moveAway(self, enemy);
    } else {
        if (enemyAttackHead) {
            skill(1);
            skill(2);
            skill(3);
            skill(2);
            skill(1);
        }
        //随机移动，走位
        move(Math.random() * Math.PI * 2, 400);
        sleep(50);
        hit();
    }

}