import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root",
  })
  export class ProjetService {
      private readonly baseUrl = `${environment.apiUrl}/projets`;
    
constructor(private http : HttpClient){}

allprojet(){
    
    //// nesta3mlouha ki yebda service lazmpou connexion
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*")
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    console.log(localStorage.getItem('token'))
    return this.http.get(this.baseUrl+"/afficherlist",{headers:headers})
}



addprojet(project:any){
    
    //// nesta3mlouha ki yebda service lazmpou connexion
    const user = JSON.parse(localStorage.getItem('currentUser')|| '{}');
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*")
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    //////////
    return this.http.post(this.baseUrl+"/addprojet",project,{headers:headers})
}


updatemat(id:any ,mat:any){
    
    //// nesta3mlouha ki yebda service lazmpou connexion
    const user = JSON.parse(localStorage.getItem('currentUser')|| '{}');
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*")
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    //////////
  console.log(mat)

    return this.http.put(this.baseUrl+"/updatematrielmanquant?id="+id,mat,{headers:headers})
}
archiver(id:any){
    
    //// nesta3mlouha ki yebda service lazmpou connexion
    const user = JSON.parse(localStorage.getItem('currentUser')|| '{}');
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*")
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    //////////
    return this.http.put(this.baseUrl+"/archiverprojet?id="+id,null,{headers:headers})
}
affceteruser(idp: any, idu: any) {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  let headers = new HttpHeaders()
    .set('Content-Type', 'application/json; charset=utf-8')
    .set('Authorization', 'Bearer ' + localStorage.getItem('token'));

  return this.http.post(this.baseUrl + "/affecteruser?projectId=" + idp + "&userId=" + idu,
    null,
    {
      headers: headers,
      responseType: 'text'
    }
  );
}
 
affectermateriel(idm: any, projetId: any) {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  let headers = new HttpHeaders()
    .set('Content-Type', 'application/json; charset=utf-8')
    .set('Authorization', 'Bearer ' + localStorage.getItem('token'));

  return this.http.post(this.baseUrl + "/affectermateriel?materielId=" + idm + "&projetId=" + projetId,
    null,
    {
      headers: headers,
      responseType: 'text'
    }
  );
}
modif(objectdomaine:any){
  return this.http.put(this.baseUrl+"domaine/modifier",objectdomaine,{})
}

afficherbyid(id:any){
    
  
  return this.http.get(this.baseUrl+"domaine/afficherbyid?id="+id,{})
}



  }