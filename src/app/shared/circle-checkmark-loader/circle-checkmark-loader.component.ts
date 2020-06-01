import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-circle-checkmark-loader',
  templateUrl: './circle-checkmark-loader.component.html',
  styleUrls: ['./circle-checkmark-loader.component.scss']
})
export class CircleCheckmarkLoaderComponent implements OnInit {

  @Input() complete: boolean;

  constructor() { }

  ngOnInit() {
  }

}
