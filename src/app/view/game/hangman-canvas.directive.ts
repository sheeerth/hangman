import {AfterViewInit, Directive, ElementRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appHangmanCanvas]'
})
export class HangmanCanvasDirective implements AfterViewInit {
  @Input() set mistakesCounter(mistakeNumber: number) {
    this.draw(mistakeNumber);
  }
  canvas?: HTMLCanvasElement;

  constructor(private viewContainer: ViewContainerRef, private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.canvas = this.el.nativeElement;
  }

  private draw(mistakeNumber: number): void {
    if (!this.canvas) {
      return;
    }

    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const lineHeight = 15;

    ctx.beginPath();
    ctx.fillStyle = '#000';

    switch (mistakeNumber) {
      case 0:
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        break;
      case 1:
        ctx.fillRect(this.canvas.width / 2 - 200 / 2, this.canvas.height - 10 - lineHeight, 200, lineHeight);
        break;
      case 2:
        ctx.fillRect(this.canvas.width / 2 - 15 / 2 - 35, this.canvas.height - 10 - 200 - lineHeight, lineHeight, 200);
        break;
      case 3:
        ctx.fillRect(this.canvas.width / 2 - 15 / 2 - 35, this.canvas.height - 10 - 200 - lineHeight * 2, 125, 15);
        break;
      case 4:
        ctx.rotate(Math.PI / 4 * 3);
        ctx.transform(1, 0, 0, -1, 0, 0);
        ctx.fillRect(-70, 155, 65, 10);
        ctx.transform(1, 0, 0, -1, 0, 0);
        ctx.rotate(0 - Math.PI / 4 * 3);
        break;
      case 5:
        ctx.moveTo(this.canvas.width / 2 - 15 / 2 - 35 + 125, this.canvas.height - 10 - 200 - lineHeight * 2 + lineHeight);
        ctx.lineTo(this.canvas.width / 2 - 15 / 2 - 35 + 125, this.canvas.height - 10 - 200 - lineHeight * 2 + lineHeight + 21);
        break;
      case 6:
        const radius = 20;
        const x = this.canvas.width / 2 - 15 / 2 - 35 + 125;
        const y = this.canvas.height - 10 - 200 - lineHeight * 2 + lineHeight * 2 + 25;

        const handsLong = 20;
        const legsLong = 30;
        const bodyLength = 70;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + bodyLength);
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x + handsLong, y + 40);
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x - handsLong, y + 40);
        ctx.moveTo(x, y + bodyLength);
        ctx.lineTo(x + legsLong, y + bodyLength + legsLong);
        ctx.moveTo(x , y + bodyLength);
        ctx.lineTo(x - legsLong, y + bodyLength + legsLong);
        ctx.stroke();
        break;
    }

    ctx.stroke();
  }
}
