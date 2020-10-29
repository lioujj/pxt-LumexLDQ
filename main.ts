/**
* LUMEX 七節顯示器的函數
*/

//% weight=0 color=#3c57f0 icon="\uf012" block="Lumex 7-seg"
namespace LumexLDQ {
    let allDigits=4;
    let LDQ_tx=SerialPin.P1
    let LDQ_rx=SerialPin.P2
    export enum indicatorMode {
        //% block="Mode 1"
        mode0 = 0,
        //% block="Mode 2"
        mode1 = 1,
        //% block="Mode 3"
        mode2 = 2
    }
    export enum indicator {
        //% block="left side"
        indicator4 = 4,
        //% block="right side"
        indicator5 = 5,
        //% block="both sides"
        indicator6 = 6
    }
    export enum numAlign {
        //% block="left"
        left = 1,
        //% block="right"
        right = 2
    }
    export enum digits_count {
        //% block="3"
        digit1 =3,
        //% block="4"
        digit2 =4,
        //% block="5"
        digit3 =5,
        //% block="6"
        digit4 =6
    }
    export enum onOff {
        //% block="ON"
        on = 1,
        //% block="OFF"
        off = 0
    }

    /**
     * Setup Lumex Seven-segment display Tx Rx to micro:bit pins.
     * 設定Lumex 七節顯示器的Tx、Rx連接腳位
     * @param pinRX to pinRX ,eg: SerialPin.P2
     * @param pinTX to pinTX ,eg: SerialPin.P1
    */
    //% blockId="LDQ_setSerial" block="set display RX to %pinTX| TX to %pinRX"
    //% weight=100 blockInlineInputs=true blockGap=10
    export function LDQ_setSerial(pinTX: SerialPin, pinRX: SerialPin): void {
        LDQ_tx=pinTX;
        LDQ_rx=pinRX;
        basic.pause(100)
        serial.redirect(
            LDQ_tx,
            LDQ_rx,
            BaudRate.BaudRate115200
        )
        basic.pause(6)
    }

    //% blockId="LDQ_serialReconnect" block="set display reconnect to micro:bit serial"
    //% weight=98 blockGap=10
    export function LDQ_serialReconnect(): void {
        serial.redirect(
            LDQ_tx,
            LDQ_rx,
            BaudRate.BaudRate115200
        )
        basic.pause(6)
    }

    //% blockId="LDQ_setDigitsCount" block="set the length of display characters:| %myDigit"
    //% weight=96 blockGap=10
    export function LDQ_setDigitsCount(myDigit:digits_count):void{
        allDigits=myDigit
    }
    //% blockId="LDQ_clear" block="display clear"
    //% weight=94 blockGap=10
    export function LDQ_clear(): void {
        serial.writeString("ATd0=()")
        basic.pause(6)
    }
    //% blockId="LDQ_blink" block="Start to blink, frequency(0~10): %freq"
    //% weight=92 freq.min=0 freq.max=10 freq.defl=5
    export function LDQ_blink(freq:number): void {
        serial.writeString("ate1=("+freq+")")
        basic.pause(6)
        serial.writeString("ate0=(1)")
        basic.pause(6)
    }
    //% blockId="LDQ_stopBlink" block="Stop blinking"
    //% weight=90 blockGap=10
    export function LDQ_stopBlink(): void {
        serial.writeString("ate0=(0)")
        basic.pause(6)
    }
    //% blockId="LDQ_lightLevel" block="Adjust display brightness(0~4):%lightLevel"
    //% weight=88 blockGap=10 lightLevel.min=0 lightLevel.max=4 lightLevel.defl=4
    export function LDQ_lightLevel(lightLevel:number): void {
        serial.writeString("atf2=("+lightLevel+")")
        basic.pause(6)
    }
    //% blockId="LDQ_putNumber" block="show number %myNum| align: %align"
    //% weight=86 blockGap=10
    export function LDQ_putNumber(myNum:number,align:numAlign): void {
        let myTempStr=""+myNum;
        myTempStr=myTempStr.replaceAll("-"," ")
        let tempStr=myTempStr.replaceAll(".","")
        if (align==2){
          if (tempStr.length<allDigits){
            for(let i=0;i<(allDigits-tempStr.length);i++)
              myTempStr=" "+myTempStr
          }
        }
        serial.writeString(myTempStr)
        basic.pause(6)
    }
    //% blockId="LDQ_putString" block="show string %myStr"
    //% weight=84 blockGap=10
    export function LDQ_putString(myStr:string): void {
        let myTempStr=myStr
        let max=myTempStr.length
        if (max>allDigits)
          max=allDigits
        for(let i=0;i<max;i++){
          serial.writeString("at80=(0,"+i+","+myTempStr.substr(i, 1) +")")
          basic.pause(6)
        }
    }

    //% blockId="LDQ_putSingle" block="show single number %myNum| on location:%index_X"
    //% weight=82 blockGap=10 index_X.min=0 index_X.max=5 myNum.min=0 myNum.max=9
    export function LDQ_putSingle(myNum:number,index_X:number): void {
        serial.writeString("at80=(0,"+index_X+","+myNum+")")
        basic.pause(6)
    }

    //% blockId="LDQ_noIndicator" block="clear %myIndicator indicator light"
    //% weight=80 blockGap=10
    export function LDQ_noIndicator(myIndicator: indicator): void {
        if (myIndicator==6){
          serial.writeString("at80=(0,4, )")
          basic.pause(6)
          serial.writeString("at80=(0,5, )")
          basic.pause(6)
        } else {
          serial.writeString("at80=(0,"+myIndicator+", )")
          basic.pause(6)
        }
    }

    //% blockId="LDQ_indicatorMode" block="set indicators display mode: %myMode"
    //% weight=78 blockGap=10
    export function LDQ_indicatorMode(myMode: indicatorMode): void {
        serial.writeString("ate2=("+myMode+")")
        basic.pause(6)
    }

    //% blockId="LDQ_indicatorLevel" block="display %myIndicator indicator pattern, ID：(0~6) %myLevel"
    //% weight=76 blockGap=10
    export function LDQ_indicatorLevel(myIndicator: indicator, myLevel:number): void {
        if (myIndicator==6){
          serial.writeString("at80=(0,4,"+myLevel+")")
          basic.pause(6)
          serial.writeString("at80=(0,5,"+myLevel+")")
          basic.pause(6)
        } else {
          serial.writeString("at80=(0,"+myIndicator+","+myLevel+")")
          basic.pause(6)
        }
    }

    //% blockId="LDQ_indicatorSingle" block="set %myIndicator single LED %myOnOff, LED index(0~6)： %ledIndex"
    //% weight=74 blockGap=10 ledIndex.min=0 ledIndex.max=6
    export function LDQ_indicatorSingle(myIndicator:indicator,myOnOff:onOff,ledIndex:number): void {
        let myTempStr="at"
        if (myIndicator==4)
          myTempStr=myTempStr+"a"
        else if (myIndicator==5)
          myTempStr=myTempStr+"b"
        else
          myTempStr=myTempStr+"2"
        myTempStr=myTempStr+ledIndex+"=("+myOnOff+")"
        serial.writeString(myTempStr)
        basic.pause(6)
    }
}