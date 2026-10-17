-- Macht ein Konto zum Betreiber. Vorher die E-Mail durch deine eigene ersetzen.
-- Erst ausführen, nachdem du dich in der App einmal angemeldet hast.
update public.creator_profiles
set role = 'operator'
where id = (select id from auth.users where email = 'DEINE-E-MAIL@beispiel.de');
