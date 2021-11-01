import { animate, style, transition, trigger } from '@angular/animations';


export const fadeOnChange = trigger('fadeOnChange', [
  transition(':leave', [
    animate('200ms',
      style({
        opacity: 0,
        height: 'calc(var(--header-height) * 0.8)',
        width: 'calc(var(--header-height) * 0.8)'
      })
    )
  ]),
  transition(':enter', [
    style({
      opacity: 0,
      height: 'calc(var(--header-height) * 0.8)',
      width: 'calc(var(--header-height) * 0.8)'
    }),
    animate('200ms',
      style({
        opacity: 1,
        height: 'var(--header-height)',
        width: 'var(--header-height)'
      })
    )
  ])
]);
