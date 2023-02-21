import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Toast } from '@capacitor/toast';
import { ModalController } from '@ionic/angular';

import { OrmService } from '../services/orm.service';
import { Author } from '../entities/author/author';
import { Category } from '../entities/author/category';
import { Post } from '../entities/author/post';
import { PostPage } from 'src/app/pages/author/post/post.page';
import { PostsPage } from 'src/app/pages/author/posts/posts.page';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mainForm!: FormGroup;
  categoryGroup!: FormGroup;
  authorGroup!: FormGroup;
  categories!: FormControl;
  authors!: FormControl;

  public authorsData: any[] = [];
  public authorList: Author[] = [];
  public categoryList: Category[] = [];
  public postList: Post[] = [];
  public sqliteInitialized: Observable<boolean>;

  constructor(
    private ormService: OrmService,
    private modalCtrl: ModalController
  ) {
    this.sqliteInitialized = ormService.observeSqliteStatus().pipe(
      switchMap((ready) => {
        if (ready) {
          return from(this.initOrmService());
        }
        return throwError(
          () => new Error('SQLite was not properly initialized')
        );
      }),
      switchMap(() => {
        if (!this.ormService.isOrmService) {
          return throwError(
            () => new Error(`Error: TypeOrm Service didn't start`)
          );
        }
        return of(true);
      })
    );
  }

  // Private methods
  /**
   * Initialize the TypeOrm service
   */
  async initOrmService() {
    try {
      await this.ormService.initialize();
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      throw new Error(`Error: ${msg}`);
    }
  }
  /**
   * add a post
   */
  async addPost() {
    const modal = await this.modalCtrl.create({
      component: PostPage,
      canDismiss: true,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      if (data) {
        await Toast.show({
          text: `addPost: ${JSON.stringify(data)}`,
          duration: 'long',
        });
      }
    }
  }
  /**
   * list the post
   */
  async listPost() {
    const modal = await this.modalCtrl.create({
      component: PostsPage,
      canDismiss: true,
    });
    modal.present();
  }
}
