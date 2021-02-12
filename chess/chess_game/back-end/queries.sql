-- SQL queries to be fed to anosql
-- Queries below are more or less SQLite/Postgres compatible, however:
-- - LIKE below is case insensitive with sqlite but case sensitive with pg.
-- - FOR UPDATE is not parsed by sqlite.

-- name: get_now
SELECT CURRENT_TIMESTAMP;

-- name: get_utilisateur_pseudo
SELECT pseudo FROM utilisateur WHERE pseudo= :pseudo;

-- name: get_utilisateur_pseud
SELECT pseudo FROM utilisateur WHERE pseudo LIKE :pseudo;

-- name: set_utilisateur!
INSERT INTO utilisateur(pseudo, mdp)
  VALUES (:pseudo, :mdp)
ON CONFLICT (pseudo) DO
  UPDATE SET mdp = EXCLUDED.mdp;

-- name: insert_utilisateur!
INSERT INTO utilisateur(pseudo, nom, prenom, mdp)
  VALUES (:pseudo, :nom, :prenom, :mdp);

-- name: update_utilisateur!
UPDATE utilisateur SET mdp=:mdp WHERE pseudo= :pseudo;

-- name: del_utilisateur_pseudo!
DELETE FROM utilisateur WHERE pseudo= :pseudo;

-- name: del_utilisateur_filter!
DELETE FROM utilisateur WHERE pseudoLIKE :filter;

-- name: del_utilisateur_all!
DELETE FROM utilisateur WHERE TRUE;

-- name: get_utilisateur_all
SELECT pseudo, mdp FROM utilisateur ORDER BY 1;

-- name: get_motdepasse
SELECT mdp FROM utilisateur WHERE pseudo= :pseudo;

-- name: get_utilisateur_filter
SELECT pseudo, mdp FROM utilisateur WHERE pseudoLIKE :filter ORDER BY 1;

-- name: is_admin
SELECT isAdmin FROM Auth WHERE login = :login;

-- name: can_write
SELECT canWrite FROM Auth WHERE login = :login;

-- name: can_read
SELECT canRead FROM Auth WHERE login = :login;

-- name: get_auth_all
SELECT login, password, isAdmin, canWrite, canRead
FROM Auth
ORDER BY 1;

-- name: get_auth_filter
SELECT login, password, isAdmin, canWrite, canRead
FROM Auth
WHERE login LIKE :filter
ORDER BY 1;

-- name: get_auth_login
SELECT password, isAdmin, canWrite, canRead
FROM Auth
WHERE login = :login;

-- name: get_auth_login_lock
SELECT password, isAdmin, canWrite, canRead
FROM Auth
WHERE login = :login
FOR UPDATE;

-- name: insert_auth!
INSERT INTO Auth(login, password, isAdmin, canWrite, canRead)
VALUES (:login, :password, :is_admin, :can_write, :can_read);

-- name: update_auth!
UPDATE Auth
SET password = :password, isAdmin = :is_admin, canWrite = :can_write, canRead = :can_read
WHERE login = :login;

-- name: update_auth_password!
UPDATE Auth
SET password = :password
WHERE login = :login;

-- name: update_auth_isadmin!
UPDATE Auth
SET isAdmin = :is_admin
WHERE login = :login;

-- name: update_auth_canwrite!
UPDATE Auth
SET canWrite = :can_write
WHERE login = :login;

-- name: update_auth_canread!
UPDATE Auth
SET canRead = :can_read
WHERE login = :login;

-- name: delete_auth_login!
DELETE FROM Auth WHERE login = :login;

-- name: delete_auth_all!
DELETE FROM Auth WHERE TRUE;

-- name: delete_auth_filter!
DELETE FROM Auth WHERE login LIKE :filter;

-- name: lancer_partie!
INSERT INTO partie(j1,j2)
  VALUES (:j1,:j2);

-- name: get_partie
SELECT pid FROM partie WHERE pid= :pid;

--name: post_fen!
UPDATE partie SET fen = :config WHERE pid = :num;

--name: get_fen
SELECT fen FROM partie WHERE pid = :num;