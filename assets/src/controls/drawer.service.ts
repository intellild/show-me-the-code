import { Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable()
export class DrawerService {
  constructor(private readonly overlay: Overlay) {}
}
