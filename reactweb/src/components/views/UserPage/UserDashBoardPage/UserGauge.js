import canvas, { RadialGauge } from 'canvas-gauges'


const CreateGauge = (id, title, mjTicks, max, highlights, value) => {
    let gauge = new RadialGauge({
        renderTo: id, // identifier of HTML canvas element or element itself
        width: 210,
        height: 180,
        units: 'dBm',
        title: title,
        valueInt: 2,
        valueDec: 1,
        value: value,
        minValue: 0,
        startAngle: 60,
        ticksAngle: 240,
        maxValue: max,
        majorTicks: mjTicks,
        minorTicks: 5,
        strokeTicks: true,
        highlights: highlights,
        colorPlate: "#fff",
        colorValueBoxBackground: '#fff',
        borderShadowWidth: 0,
        borders: false,
        needleType: "arrow",
        needleWidth: 2,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        animationDuration: 1000,
        animationRule: "linear"
    })

    return gauge;
}

export default CreateGauge;