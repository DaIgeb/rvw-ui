import { Component, LOCALE_ID, Inject } from "@angular/core";

@Component({
  selector: "rvw-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "rvw";

  constructor(@Inject(LOCALE_ID) protected localeId: string) {
    console.log(localeId);
  }
}
