service HelloBaseSvc {
  string echob(1:string name);
}

service HelloSvc extends HelloBaseSvc {
  string echo(1:optional string name);
}
