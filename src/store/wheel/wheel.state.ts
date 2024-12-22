import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { SetPrize } from './wheel.actions';

export interface WheelStateModel {
  prize: string | null;
}

@State<WheelStateModel>({
  name: 'wheel',
  defaults: {
    prize: null,
  },
})
@Injectable()
export class WheelState {
  @Selector()
  static getState(state: WheelStateModel) {
    return state;
  }

  @Selector()
  static getPrize(state: WheelStateModel): string | null {
    console.log({ state });
    return state.prize;
  }

  @Action(SetPrize)
  setPrize(ctx: StateContext<WheelStateModel>, { payload }: SetPrize) {
    ctx.patchState({ prize: payload });
  }
}
