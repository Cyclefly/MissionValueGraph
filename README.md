# MissionValueGraph
## Allgemein:
-Es werden fast keine extra Serveranfragen gemacht, nur einmal pro Session um alle verfügbaren Einsätze ("Missions-Katalog") mit Ihrem Wert zu laden.
-Für euch interessant ist vor allem missionDuration: Die geschätzte Missionsdauer, die Ihr direkt zu Beginn des Skripts anpassen solltet. In unserem Verein gibt es -zum Beispiel die Regel, dass nach 20 Stunden alles beendet werden darf und es ist nahezu rund um die Uhr jemand aktiv. Voreingestellt sind 20 Stunden, mit 0 Stunden könnt Ihr sehen, wann die Missionen erstellt wurden.

## Missionswert-Anzeige:
-Der obere Wert gibt an, wieviel die von euch angefahrenen Einsätze wert sind.
-Der untere Wert gibt an, wieviel alle verfügbaren Einsätze wert sind.
-Es fließen alle Einsätze mit ihrem durchschnittlichen Wert ein
-Das Skript aktualisiert sich alle 5 Sekunden.
-Missionen zu denen Ihr keine Fahrzeuge in Reichweite habt zählen nicht mit, Ihr solltet also den Wert der verfügbaren Einsätze erreichen können.

## Graph:
-Dieser wird durch einen Klick auf den Missionswert geöffnet.
-Angezeigt wird nur der Missionswert der angefahrenen Einsätze, sowie der Kontostand mit den verdienten Credits zum gleichen Zeitpunkt, zur Planung.
-Ebenfalls angezeigt wird der aktulle Zeitpunkt mit einer roten, vertikalen Linie. Solltet ihr eine Missionsdauer größer 0 gewählt haben und es sind Einträge auf der linken Seite heißt dass für euch, dass diese schon beendet werden können, Ihr könntet Sie also sofort beenden und das Geld verdienen, weswegen Sie auch mit aufaddiert werden.
-Der Graph ist darauf angewiesen, dass zu den jeweiligen Missionen eine Zeit im lokalen Speicher hinterlegt ist. Wenn Ihr also viel am Handy spielt könnte der dargestellte Missionswert am Ende weniger ergeben als in der Ansicht auf der Hauptseite. Aktuell werden diese Missionen mit Link zur Mission in der Konsole ausgegeben, falls Ihr noch dargestellt haben wollt kurz öffnen und nochmal den Graphen öffnen.
-Es müssen mindestens 3 Einsätze angefahren werden, die auch mit Zeit hinterlegt sind (Alarmierungsfenster des Einsatzes wurde im Browser betrachtet). Ansonsten gibt es Fehler bei der Erstellung des Graphen. In diesem Fall wird anstatt dem Graphen eine enstprechender Hinweis ausgegeben.
-Geplante Einsätze werden mit Ihrer wahren Zeit der Fertigstellung dargestellt.
-Falls Ihr den Missionswert nicht gut erkennen könnt da Ihr zu viel Geld auf dem Konto habt: Durch einen Klick auf den unerwünschten Datensatz in der Legende wird dieser nicht mehr dargestellt.

## Aussicht:
-Eventuell lasse ich zu einem späteren Zeitpunkt die Missionsdauer anhand des Missionstypes und dem Datum der Erstellung berechnen. Das eine Mission um 4 Uhr morgens berechnet wird ist in der Regel wohl unwahrscheinlicher als zu den Stoßzeiten. Den Zusammenhang zu lernen ist dabei kein Problem, aber es müssen auch erstmal Daten erhoben werden. Außerdem variiert die Missionsdauer dann noch von Verein zu Verein usw.
