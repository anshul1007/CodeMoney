import { Type } from '@angular/core';

import { BaseGameComponent } from './base-game.models';
import { EstimationGameData, FundingGameData, SelectionGameData } from './game.models';

export interface GameRegistry {
  selection: {
    component: () => Promise<Type<BaseGameComponent>>;
    dataType: SelectionGameData;
  };
  estimation: {
    component: () => Promise<Type<BaseGameComponent>>;
    dataType: EstimationGameData;
  };
  funding: {
    component: () => Promise<Type<BaseGameComponent>>;
    dataType: FundingGameData;
  };
}

export type GameType = keyof GameRegistry;

export const GAME_REGISTRY: GameRegistry = {
  selection: {
    component: () =>
      import('../components/games/selection-game.component').then(
        (m) => m.SelectionGameComponent as Type<BaseGameComponent>,
      ),
    dataType: {} as SelectionGameData, // Type placeholder
  },
  estimation: {
    component: () =>
      import('../components/games/estimation-game.component').then(
        (m) => m.EstimationGameComponent as Type<BaseGameComponent>,
      ),
    dataType: {} as EstimationGameData,
  },
  funding: {
    component: () =>
      import('../components/games/funding-game.component').then(
        (m) => m.FundingGameComponent as Type<BaseGameComponent>,
      ),
    dataType: {} as FundingGameData,
  },
} as const;
