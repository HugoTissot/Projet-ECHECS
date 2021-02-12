create table utilisateur(
  id serial primary key, 
  pseudo text unique not null,
  nom text,
  prenom text,
  elo int,
  recherche boolean,
  mdp text not null
  );

create table est_ami(
  aid1 int not null references utilisateur(id), 
  aid2 int not null references utilisateur(id),
  unique(aid1, aid2)
);

create table msg(
  mid serial primary key,
  exp int not null references utilisateur(id),
  dest int not null references utilisateur(id),
  msg Text not null,
  quand time
  );

create table joue(

);

create table partie(
  j1 int not null references utilisateur(id),
  j2 int not null references utilisateur(id),
  pid serial primary key,
  fen text not null
);
