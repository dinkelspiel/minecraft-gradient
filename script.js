class Color {
    constructor(r, g, b, a)
    {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }

    fromHexString(hex) {
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return new Color((c>>16)&255, (c>>8)&255, c&255, 255)
        }
        throw new Error('Bad Hex');
    }

    toHexString() {
        const red = this.r.toString(16).padStart(2, '0');
        const green = this.g.toString(16).padStart(2, '0');
        const blue = this.b.toString(16).padStart(2, '0');
        const alpha = this.a.toString(16).padStart(2, '0');
    
        return `#${red}${green}${blue}${alpha}`;
    }
}

class ControlPoint {
    constructor(x, color)
    {
        this.x = x
        this.color = color
    }
}

let controlPoints = [
    new ControlPoint(0.0, new Color(255, 0, 0, 255)),
    new ControlPoint(1.0, new Color(0, 0, 255, 255))
]

var numItems = 10
var widthItems = 1
var offsetItems = 0
var onlySolids = true

function dragMouseDown(e) {
    // e = e || window.event;
    // e.preventDefault();

    // console.log(`pressed ${e.target.id}`)

    // console.log(controlPoints[e.target.id].x / 600)

    document.onmousemove = elementDrag
    document.onmouseup = closeDragElement
}

function elementDrag(e) {
    // console.log(e)
    if(e.target.id != "") {
        gradient = document.getElementById('gradient')

        controlPoints[e.target.id].x = (e.clientX - gradient.getBoundingClientRect().left) / (gradient.getBoundingClientRect().right - gradient.getBoundingClientRect().left)

        if(controlPoints[e.target.id].x < 0)
        {
            controlPoints[e.target.id].x = 0
        }

        if(controlPoints[e.target.id].x > 1)
        {
            controlPoints[e.target.id].x = 1
        }
    }

    generatePointsHTML()
    generateCSSGradient()
    generateMinecraftBlocks()
}

function generatePointsHTML() {
    // doc = document.getElementById('control-points')
    // doc.innerHTML = ""
    // gradient = document.getElementById('gradient')
    
    
    // controlPoints.forEach((point, i) => {
    //   html = `<div class="point" id="${i}" style="margin-left: ${point.x * (gradient.getBoundingClientRect().right - gradient.getBoundingClientRect().left) - 15}px; top: ${gradient.getBoundingClientRect().bottom}px"></div>`
    //   doc.innerHTML += html
    // })
    
    // // Assign event handler to all control points
    // document.querySelectorAll('.point').forEach(point => {
    //     point.onmousedown = dragMouseDown
    //     point.addEventListener('contextmenu', e => {
    //         e.preventDefault()
    //     })
    // })

    document.getElementById('color-list').innerHTML = ""
    controlPoints.forEach((point, i) => {
        html = `
            <li class="list-group-item">
                <div class="d-flex align-items-center">
                    <div class="list-color me-2" style="background-color: ${point.color.toHexString()}">

                    </div>
                    Point ${i}
                    <button class="btn btn-danger ms-auto" onclick="    
                    controlPoints.splice(${i}, 1);
                    generatePointsHTML()
                    generateCSSGradient()
                    generateMinecraftBlocks()
                    
                    ">Remove</button>
                </div>

                <div class="d-flex align-items-center">
                    <div class="me-2">R</div>
                    <input type="range" class="form-control-range" id="formControlRange" min=0 max=255 step=1 value=${point.color.r}
                    onchange="
                    controlPoints[${i}].color.r = parseInt(event.target.value)
                    generatePointsHTML()
                    generateCSSGradient()
                    generateMinecraftBlocks()
                    ">
                    <br/>
                </div>
                <div class="d-flex align-items-center">
                    <div class="me-2">G</div>
                    <input type="range" class="form-control-range" id="formControlRange" min=0 max=255 step=1 value=${point.color.g}
                    onchange="
                    controlPoints[${i}].color.g = parseInt(event.target.value)
                    generatePointsHTML()
                    generateCSSGradient()
                    generateMinecraftBlocks()
                    ">
                    <br/>
                </div>
                <div class="d-flex align-items-center">
                    <div class="me-2">B</div>
                    <input type="range" class="form-control-range" id="formControlRange" min=0 max=255 step=1 value=${point.color.b} 
                    onchange="
                    controlPoints[${i}].color.b = parseInt(event.target.value)
                    generatePointsHTML()
                    generateCSSGradient()
                    generateMinecraftBlocks()
                    ">
                    <br/>
                </div>
                <div class="d-flex align-items-center">
                    <div class="me-2">X</div>
                    <input type="range" class="form-control-range" id="formControlRange" min=0 max=100 value=${point.x * 100} 
                    onchange="
                    controlPoints[${i}].x = parseInt(event.target.value) / 100
                    generatePointsHTML()
                    generateCSSGradient()
                    generateMinecraftBlocks()
                    ">
                    <br/>
                </div>
            </li>
        `

        document.getElementById('color-list').innerHTML += html
    })
}

function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
}

// linear-gradient(to right, #3494E6 0.5%, #333333 53.31%, #986a44 55.02%, #333333 77.88%, #EC6EAD 99%)

function generateCSSGradient() {
    var gradient = "background: linear-gradient(to right, "

    var sortedPoints = controlPoints.sort((a, b) => a.x - b.x)

    sortedPoints.forEach(point => {
        gradient += `${point.color.toHexString()} ${point.x * 100}%, `
    })

    gradient = gradient.substring(0, gradient.length - 2);
    gradient += ");"

    document.getElementById("gradient").setAttribute("style", gradient);
}

doc = document.getElementById('gradient')
doc.onmousedown = (e) => {

    gradient = document.getElementById('gradient')

    var index = undefined
    controlPoints.forEach((point, i) => {
        if(point.x > e.clientX / (gradient.getBoundingClientRect().right - gradient.getBoundingClientRect().left) && index == undefined)
        {
            index = i
        }
    })
    
    controlPoints.splice(index, 0, new ControlPoint(
        e.clientX / (gradient.getBoundingClientRect().right - gradient.getBoundingClientRect().left),
        new Color(255, 255, 255, 255)
    ))

    // controlPoints.forEach((point, i) => {
    //     html = `<div class="point" id="${i}" style="margin-left: ${point.x * (gradient.getBoundingClientRect().right - gradient.getBoundingClientRect().left) - 15}px; top: ${gradient.getBoundingClientRect().bottom}px"></div>`
    //     doc.innerHTML += html
        
    //     document.getElementById(`${i}`).onmousedown = dragMouseDown
    // })

    generatePointsHTML()
    generateCSSGradient()
    generateMinecraftBlocks()
}

function getBlockByColor(color)
{
    smallestDiffNum = 99999999;
    smallestDiffBlock = "";

    Object.keys(blocks).forEach(key => {
        e = blocks[key]

        if(onlySolids && e.a != 255)
        {
        } else {
            diffR = Math.abs(e.r - color.r)
            diffG = Math.abs(e.g - color.g)
            diffB = Math.abs(e.b - color.b)
            diff = diffR + diffG + diffB
    
            if(diff < smallestDiffNum)
            {
                smallestDiffNum = diff
                smallestDiffBlock = key
            }
        }
    })

    return smallestDiffBlock
}

function lerp(v0, v1, t) {
    return v0 + t * (v1 - v0);
}
  
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

function colString(color)
{
    return `r${color.r}g${color.g}b${color.b}`
}

function generateMinecraftBlocks()
{
    let group = document.getElementById('minecraft-group')
    group.innerHTML = "";

    for(var w = 0; w < widthItems; w++)
    {
        let points = []

        var sortedPoints = controlPoints.sort((a, b) => a.x - b.x)

        let startNumBlocks = Math.round(sortedPoints[0].x * numItems)

        if(startNumBlocks > 1)
        {
            var block = getBlockByColor(sortedPoints[0].color)
            for(var i = 0; i < startNumBlocks; i++)
            {
                points.push(block)
            }
        }

        for(var i = 0; i < sortedPoints.length - 1; i++)
        {
            // if(i == sortedPoints.length - 1)
            // {
            //     continue
            // }

            // console.log(i)

            var numBlocks = (sortedPoints[i + 1].x - sortedPoints[i].x) * numItems
            var lowBound = sortedPoints[i].x
            var highBound = sortedPoints[i + 1].x

            // console.log(`blocks ${(sortedPoints[i + 1].x - sortedPoints[i].x) * numItems} ${numItems}`)

            if(numBlocks < 1)
            {
                continue
            }

            for(var j = 0; j < numBlocks; j++)
            {
                let lerpValue = j / numBlocks;

                var color = new Color(0, 0, 0, 255);

                color.r = lerp(sortedPoints[i].color.r, sortedPoints[i + 1].color.r, lerpValue + ((Math.random() - 0.5) * (offsetItems / 10)))
                color.g = lerp(sortedPoints[i].color.g, sortedPoints[i + 1].color.g, lerpValue + ((Math.random() - 0.5) * (offsetItems / 10)))
                color.b = lerp(sortedPoints[i].color.b, sortedPoints[i + 1].color.b, lerpValue + ((Math.random() - 0.5) * (offsetItems / 10)))

                // console.log(lerpValue)

                var block = getBlockByColor(color)

                points.push(block)
            }
        }

        let endNumBlocks = Math.round((1 - sortedPoints[sortedPoints.length - 1].x).clamp(0, 1) * numItems)

        if(endNumBlocks > 1)
        {
            var block = getBlockByColor(sortedPoints[sortedPoints.length - 1].color)
            for(var i = 0; i < endNumBlocks; i++)
            {
                points.push(block)
            }
        }

        group.innerHTML += `<div id="minecraft${w}" class="d-flex flex-column mt-3">`

        document.getElementById(`minecraft${w}`).innerHTML = ""

        points.forEach(e => {
            document.getElementById(`minecraft${w}`).innerHTML += `<img class="minecraft-block" src="/minecraft-gradient/block/${e}"></img>` 
        })

        // console.log(points)

        group.innerHTML += "</div>"
    }
}

window.addEventListener('resize', (e) => {
    generatePointsHTML()
    generateCSSGradient()
}, true);

generateMinecraftBlocks()
generatePointsHTML()
generateCSSGradient()