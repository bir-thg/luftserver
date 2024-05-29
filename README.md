Läuft auf uberspace unter port 40081
Man kann sehen, ob es als Dienst gestartet wurde mit:
    supervisorctl
Stoppen/Starten geht mit
    supervisorctl stop luft
    supervisorctl start luft



Der Port muss NICHT freigeschaltet werden mit 
    uberspace port add
Mit 
    uberspace port list 
kann man sehen, dass ich keine Ports aufmachen musste. Das verursacht nämlich in Bezug auf HTTPS (HTTP mit SSL) Probleme

Dazu benutzt man eleganter Weise stattdessen das sog. web backend.
Die HTTPS-Anfragen werden an den Webserver geleitet und über ein virtuelles Interface dann an den eigenen Server. Damit umgeht man auch das SSL-Zertifikats-Problem. Das Lets-Encrypt-Zertifikat wird jeweils austomatisch von uberspace erneuert. Also kein Stress. Hier die Befehle für diesen Server:
    uberspace web backend set /rating --http --port 40081
    uberspace web backend set /luft --http --port 40081

Man kann dann im Browser 
    https://broesel.net/luft
aufrufen und sieht die Liste.
In der Flutter-App muss als Endpunkt zum Schicken der Daten an den Server der Endpunkt 
    https://broesel.net/rating 
verwendet werden.

Mehr ist nicht zu tun...

