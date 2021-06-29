import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import * as JWT from 'jwt-decode';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs/operators';

declare var jQuery: any;

// export var apiHost = 'https://dev.logajob.com.au';
export var apiHost = '';
// export var apiHost = 'http://localhost:56477';

export var phoneMask = ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
export var mobileMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/];
export var postcodeMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
export var yearMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
export var financeBSBMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
export var financeAccountMask: (string | RegExp)[] = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
export var timeMask = [/[0-9]/, /[0-9]/, ':', /[0-9]/, /[0-9]/];

export var phonePattern = ".{10,10}";
export var mobilePattern = ".{10,10}";
export var postcodePattern = ".{4,4}";
export var financeBSBPattern = ".{6,6}";
export var financeAccountPattern = ".{0,9}";

export var pageTile = "Jobs On Time";
export var isMobile = false;

export var invoiceDesSource = ['4-1040: Cancellation Fee', '2-1510: Incentives EFT via Farron for ',
  '2-1520: Incentives with GST', '4-9001: Incentives Paid by the Client',
  '2-1510: Incentives EFT by Farron – Standby', '2-1530: Incentive Reward for Online',
  '4-1020: Admin Fee to handle incentives', '4-1012: Online Bulletin Board',
  '4-1013: Online Survey', '4-1014: Online Project',
  '4-1011: Pilot Study', '4-1030: Project Management Fee',
  '4-1060: Recontact Fee', '4-1010: Groups Recruitment',
  '4-1000: Interviews Recruitment', '4-9004: Interview Recruitment – Standby',
  '4-1030: Set Up Fee', '4-1111: Venue Hire',
  '4-9007: Miscellaneous', '4-9003: International Transfer Fee'];

// export var passwordPattern = "(?=.*[!#$%&'()*+,-./:;<=>?@^_`{|}~])(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).*";
export var passwordPattern = "(?=.*[!#$%&'()*+,-./:;<=>?@^_`{|}~])(?=.*[0-9])(?=.*[A-Z]).*";
export var ckEditorConfigV5 = {
  toolbar: {
    items: [
      'fontFamily',
      'fontSize',
      'fontColor',
      'highlight',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'link',
      '|',
      'alignment',
      'numberedList',
      'bulletedList',
      'indent',
      'outdent',
      '|',
      'undo',
      'redo'
    ]
  },
  link: {
    decorators: {
      isExternal: {
        mode: 'manual',
        label: 'Open in a new tab',
        attributes: {
          target: '_blank'
        }
      }
    }
  },
  language: 'en'
}
export var ckEditorConfig = {
  toolbarGroups: [
    { name: 'colors', groups: ['colors'] },
    { name: 'basicstyles', groups: ['basicstyles'] },
    { name: 'paragraph', groups: ['align', 'list', 'indent'] },
    { name: 'links', groups: ['links'] },
    { name: 'forms', groups: ['forms'] },
    { name: 'tools', groups: ['tools'] }
  ],
  removePlugins: 'Save,NewPage,ExportPdf,Preview,Print,Templates,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,RemoveFormat,CopyFormatting,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Image,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Table,Styles,Format,About,PasteFromWord,PasteText,ShowBlocks,Subscript,Superscript',
  allowedContent: true, scayt_autoStartup: true, height: 200, forcePasteAsPlainText: true, autoParagraph: false, enterMode: 2,
  contentsCss: ["body {font-size: 14px;font-family: 'Roboto', sans-serif;}"]
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router,
    public loader: LoadingBarService, @Inject(PLATFORM_ID) platformId: Object, private _http: HttpClient,
    @Inject(DOCUMENT) private document) {
    if (typeof document != 'undefined')
      isMobile = document.body.clientWidth < 768 ? true : false;
    if (isPlatformBrowser(platformId)) {
      window.scrollTo(0, 0)
    }

    this.populateMaskAndPattern();
    if (apiHost == '')
      window.console.log = function () { };
  }

  apiValues: string[] = [];

  isSigninPage = true;
  isSignupPage = true;
  loginuserrole: string;
  isSurveyPage = false;
  isInitLoading = true;

  ngOnInit() {
    if (window) {
      // window.console.log=function(){};      
    }

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (typeof jQuery != 'undefined')
        jQuery(".modal-backdrop").remove();
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        let currentRoute = this.route.root;
        while (currentRoute.children[0] !== undefined) {
          currentRoute = currentRoute.children[0];
        }

        if (currentRoute.snapshot.data.name && currentRoute.snapshot.data.name == 'signin')
          this.isSigninPage = true;
        else
          this.isSigninPage = false;
        if (currentRoute.snapshot.data.name && currentRoute.snapshot.data.name == 'signup')
          this.isSignupPage = true;
        else
          this.isSignupPage = false;

        if (currentRoute.snapshot.data.name && currentRoute.snapshot.data.name == 'survey')
          this.isSurveyPage = true;
      });

    if (this.cookieService.get('auth_token')) {
      var token = JWT(this.cookieService.get('auth_token'));
      var diff = moment.unix(token.exp).diff(moment());
      if (diff >= 0)
        this.loginuserrole = token['actort'];
    }
  }

  ngDoCheck() {
    if (typeof jQuery != 'undefined') {
      var height = jQuery('#topnav').height();
      jQuery('.wrapper').css('margin-top', height + 15 + "px");

      if (jQuery(window).width() < 1256) {
        jQuery('.ui-table tr th').each(function (data, th) {
          if (jQuery(th).width() < 0) {
            //console.log(jQuery(td));
            jQuery(th).css('width', '250px');
          }
        });
        jQuery('.ui-table tr td').each(function (data, td) {
          if (jQuery(td).width() < 0) {
            //console.log(jQuery(td));
            jQuery(td).css('width', '250px');
          }
        });
      }
    }
  }

  /*getMaskAndPattern() {
    this._http.get(apiHost + '/api/config/MaskAndPattern')
      .subscribe((res: any) => {
        console.log(res)
        res.forEach((vl) => {
          if (vl.key == "PhoneMask") phoneMask = vl.value.split(",");
          if (vl.key == "MobileMask") mobileMask = vl.value.split(",");
          if (vl.key == "PostcodeMask") postcodeMask = vl.value.split(",");
          if (vl.key == "FinanceBSBMask") financeBSBMask = vl.value.split(",");
          if (vl.key == "FinanceAccountMask") financeAccountMask = vl.value.split(",");* /

          if (vl.key == "PhonePattern") phonePattern = vl.value;
          if (vl.key == "MobilePattern") mobilePattern = vl.value;
          if (vl.key == "PostcodePattern") postcodePattern = vl.value;
          if (vl.key == "FinanceBSBPattern") financeBSBPattern = vl.value;
          if (vl.key == "FinanceAccountPattern") financeAccountPattern = vl.value;
        })
      })
  }*/

  populateMaskAndPattern() {
    if (typeof this.document != 'undefined') {
      if (this.document && this.document.location && this.document.location.hostname && this.document.location.hostname.toLowerCase().indexOf('.nz') > -1) {
        phoneMask = ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
        phonePattern = ".{9,9}";
        mobileMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
        mobilePattern = ".{9,11}";
        financeAccountPattern = ".{0,16}";
        financeAccountMask = [/[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/];

        invoiceDesSource = ['21100: Recruitment income',
          '21200: Survey Income',
          '21210: Venue income - Prime',
          '21240: Venue income - Other',
          '21410: Group refreshments income',
          '21420: Viewer refreshments income',
          '21505: Incidental income',
          '21540: Researcher/ Moderator income',
          '21999: Miscellaneous income',
          '818: Incentives'];
      }
    }
  }
}