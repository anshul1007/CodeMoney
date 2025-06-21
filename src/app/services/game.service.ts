import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Type } from '@angular/core';

import { map, Observable } from 'rxjs';

import { GameData, GameType } from '../models';
import { BaseGameComponent } from '../models/base-game.models';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  #http = inject(HttpClient);

  private componentRegistry = new Map<GameType, () => Promise<Type<BaseGameComponent>>>();

  constructor() {
    this.registerComponents();
  }

  private registerComponents() {
    this.componentRegistry.set('selection', async () => {
      const { SelectionGameComponent } = await import(
        '../components/games/selection-game.component'
      );
      return SelectionGameComponent as Type<BaseGameComponent>;
    });
  }

  getGameData(
    courseId: string,
    unitId: string,
    lessonId: string,
    levelId: string,
  ): Observable<{
    gameData: GameData;
  }> {
    return this.#http
      .get<{
        gameData: GameData;
      }>(`/${courseId}-${unitId}-${lessonId}-${levelId}.json`)
      .pipe(
        map((response) => {
          return {
            gameData: response.gameData,
          };
        }),
      );
  }

  async getComponent(componentType: GameType): Promise<Type<BaseGameComponent> | null> {
    const componentLoader = this.componentRegistry.get(componentType);
    if (componentLoader) {
      return await componentLoader();
    }
    return null;
  }
}
