import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Type } from '@angular/core';

import { map, Observable } from 'rxjs';

import { GAME_REGISTRY, GameData, GameType } from '../models';
import { BaseGameComponent } from '../models/base-game.models';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  #http = inject(HttpClient);

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
      }>(`${courseId}-${unitId}-${lessonId}-${levelId}.json`)
      .pipe(
        map((response) => {
          return {
            gameData: response.gameData,
          };
        }),
      );
  }

  async getComponent(componentType: GameType): Promise<Type<BaseGameComponent> | null> {
    const registryEntry = GAME_REGISTRY[componentType];
    if (registryEntry) {
      return await registryEntry.component();
    }
    return null;
  }
}
