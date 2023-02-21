import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SQLiteService } from './services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isWeb = Capacitor.getPlatform() === 'web';

  constructor(private sqliteService: SQLiteService) {
    this.initializeApp();
  }

  async initializeApp() {
    if (this.isWeb) {
      await customElements.whenDefined('jeep-sqlite');
      const jeepSqliteElement = document.querySelector('jeep-sqlite');
      if (jeepSqliteElement != null) {
        await this.sqliteService.initializeWebStore();
        console.log(
          `>>>> isStoreOpen ${await jeepSqliteElement.isStoreOpen()}`
        );
      }
    } else {
      // It's native, no more configs are needed. It's ready to use
      this.sqliteService.sqliteReadySubject.next(true);
    }
  }
}
