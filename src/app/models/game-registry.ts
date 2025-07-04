import { Type } from '@angular/core';

import { BaseGameComponent } from './base-game.models';
import {
  BalanceSheetGameData,
  InteractiveBalanceGameData,
  MultiChoiceGameData,
  RecapGameData,
  ResourceAllocationGameData,
  ValueInputGameData,
} from './game.models';

// Generic game registry based on interaction patterns
export interface GameRegistry {
  'multi-choice': {
    component: () => Promise<Type<BaseGameComponent>>;
    dataType: MultiChoiceGameData;
  };
  'value-input': {
    component: () => Promise<Type<BaseGameComponent>>;
    dataType: ValueInputGameData;
  };
  'resource-allocation': {
    component: () => Promise<Type<BaseGameComponent>>;
    dataType: ResourceAllocationGameData;
  };
  'balance-equation': {
    component: () => Promise<Type<BaseGameComponent>>;
    dataType: BalanceSheetGameData;
  };
  'interactive-balance': {
    component: () => Promise<Type<BaseGameComponent>>;
    dataType: InteractiveBalanceGameData;
  };
  'equity-liabilities': {
    component: () => Promise<Type<BaseGameComponent>>;
    dataType: BalanceSheetGameData;
  };
  'recap': {
    component: () => Promise<Type<BaseGameComponent>>;
    dataType: RecapGameData;
  };
}

// Automatically derive GameType from registry keys
export type GameType = keyof GameRegistry;

// Type-safe game data mapping
export type GameDataMap = {
  [K in GameType]: GameRegistry[K]['dataType'];
};

export const GAME_REGISTRY: GameRegistry = {
  'multi-choice': {
    component: () =>
      import('../components/games/selection-game.component').then(
        (m) => m.SelectionGameComponent as Type<BaseGameComponent>,
      ),
    dataType: {} as MultiChoiceGameData,
  },
  'value-input': {
    component: () =>
      import('../components/games/estimation-game.component').then(
        (m) => m.EstimationGameComponent as Type<BaseGameComponent>,
      ),
    dataType: {} as ValueInputGameData,
  },
  'resource-allocation': {
    component: () =>
      import('../components/games/funding-game.component').then(
        (m) => m.FundingGameComponent as Type<BaseGameComponent>,
      ),
    dataType: {} as ResourceAllocationGameData,
  },
  'balance-equation': {
    component: () =>
      import('../components/games/balance-equation-game.component').then(
        (m) => m.BalanceEquationGameComponent as Type<BaseGameComponent>,
      ),
    dataType: {} as BalanceSheetGameData,
  },
  'interactive-balance': {
    component: () =>
      import('../components/games/interactive-balance-game.component').then(
        (m) => m.InteractiveBalanceGameComponent as Type<BaseGameComponent>,
      ),
    dataType: {} as InteractiveBalanceGameData,
  },
  'equity-liabilities': {
    component: () =>
      import('../components/games/equity-liabilities-game.component').then(
        (m) => m.EquityLiabilitiesGameComponent as Type<BaseGameComponent>,
      ),
    dataType: {} as BalanceSheetGameData,
  },
  'recap': {
    component: () =>
      import('../components/games/recap-game.component').then(
        (m) => m.RecapGameComponent as Type<BaseGameComponent>,
      ),
    dataType: {} as RecapGameData,
  },
} as const;
