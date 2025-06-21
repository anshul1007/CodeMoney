import { inject, Injectable, Type } from '@angular/core';
import { BaseGameComponent } from '../models/base-game.models';
import { GameData, GameType, Level } from '../models';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  #http = inject(HttpClient);

  private componentRegistry = new Map<
    GameType,
    () => Promise<Type<BaseGameComponent>>
  >();

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
    level: Pick<Level, 'id' | 'title' | 'description' | 'stars'>;
    gameData: GameData;
  }> {
    return this.#http
      .get<{
        level: Pick<Level, 'id' | 'title' | 'description' | 'stars'>;
        gameData: GameData;
      }>(`/${courseId}-${unitId}-${lessonId}-${levelId}.json`)
      .pipe(
        map((response) => {
          return {
            level: response.level,
            gameData: response.gameData,
          };
        }),
      );
  }

  async getComponent(
    componentType: GameType,
  ): Promise<Type<BaseGameComponent> | null> {
    const componentLoader = this.componentRegistry.get(componentType);
    if (componentLoader) {
      return await componentLoader();
    }
    return null;
  }
}
