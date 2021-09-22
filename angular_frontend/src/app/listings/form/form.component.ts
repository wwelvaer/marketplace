import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  fileName: string;
  imgSrc: string;
  imgError: string;

  form: FormGroup;
  error: string
  listingId: number = -1;
  categories = [];

  constructor(private user: UserService,
    private route: ActivatedRoute,
    private db: DbConnectionService,
    private router: Router,
    private image: ImageService) {
    // redirect to login page when not logged in
    if (!this.user.isLoggedIn())
        this.router.navigateByUrl("/login")
    // initialize form fields
    this.form = new FormGroup({
      name: new FormControl(),
      description: new FormControl(),
      availableAssets: new FormControl(),
      startDate: new FormControl(),
      price: new FormControl(),
    })
   }

  ngOnInit(): void {

    // get url query params
    this.route.queryParamMap.subscribe(qMap => {
      // when query has 'edit' parameter, edit listing data
      let lId = qMap['params'].edit;
      if (lId){
        this.db.getListing(lId).then(l => {
          // update listingID
          this.listingId = l['listingID']
          // fill out form with listingdata
          this.form.patchValue({
            name: l['name'],
            description: l['description'],
            availableAssets: l['availableAssets'],
            startDate: l['startDate'],
            price: l['price'],
          })
          this.getCategories(l['categories']);
        })
      } else
        this.getCategories();

    })
  }

  // get categories
  getCategories(selected=[]){
    this.db.getCategories().then(r => {
      this.categories = [];
      r['categories'].forEach(x => {
        x['checked'] = selected.includes(x['name']);
        this.categories.push(x)
      });
    })
  }

  // select file
  fileSelected(ev){
    // no files selected
    if (ev.target.files.length === 0)
      return;
    // reset variables
    this.imgError = undefined;
    this.imgSrc = undefined;
    let f: File = <File>ev.target.files[0];
    this.fileName = f.name;
    // convert image to standard format
    this.image.convertFileToJpegBase64(f, (c) => {
      this.imgSrc = c;
    }, (err) => {
      this.imgError = err;
    })
  }

  // onSubmit function
  createListing(){
    // get values
    let values = this.form.getRawValue();
    // add selected categories
    values['categories'] = this.categories.filter(x => x.checked).map(x => x.name)
    // add image
    if (this.imgSrc)
      values['picture'] = this.imgSrc;
    // create listing
    if (this.listingId < 0)
      this.db.createListing(this.user.getLoginToken(), values).then(r => {
        // go to details page
        this.router.navigateByUrl(`/listings/details/${r['listingID']}`)
      }).catch(err => this.error = err.error.message)
    else // update listing
      this.db.postListing(this.listingId, this.user.getLoginToken(), values).then(r => {
        // go to details page
        this.router.navigateByUrl(`/listings/details/${this.listingId}`)
      }).catch(err => this.error = err.error.message)
  }
}
