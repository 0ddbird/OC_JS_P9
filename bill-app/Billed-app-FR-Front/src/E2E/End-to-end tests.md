# Plan de test End-to-End du parcours Employé

## Scénario 1

**GIVEN** : Je suis un visiteur (non connecté)
**WHEN** : Je ne remplis pas le champ e-mail ou le champ password du login employé et je clique sur le bouton "Se connecter"
**THEN** : Je reste sur la page Login et je suis invité à remplir le champ manquant

## Scénario 2

**GIVEN** : Je suis un visiteur (non connecté)
**WHEN** : Je remplis le champ e-mail du login employé au mauvais format (sans la forme chaîne@chaîne) et je clique sur le bouton "Se connecter".
**THEN** : Je reste sur la page Login et je suis invité à remplir le champ e-mail au bon format.

## Scénario 3

**GIVEN** : Je suis un visiteur (non connecté).
**WHEN** : Je remplis le champ e-mail du login employé au bon format (sous la forme chaîne@chaîne), le champ password du login employé et je clique sur le bouton "Se connecter".
**THEN** : Je suis envoyé sur la page Dashboard.

## Scénario 4

**GIVEN** : Je suis connecté en tant qu'employé sur la page Dashboard
**WHEN** : J'ai des factures existantes
**THEN** : Je peux voir la liste de ces factures classées par ordre chronologique

## Scénario 5

**GIVEN** : Je suis connecté en tant qu'employé sur la page Dashboard
**WHEN** : Je n'ai pas de factures existantes
**THEN** : Mon dashboard contient uniquement le bouton "Nouvelle note de frais"

## Scénario 6

**GIVEN** : Je suis connecté en tant qu'employé sur la page Dashboard
**WHEN** : Je clique sur le bouton "Nouvelle note de frais"
**THEN** : Je suis envoyé vers la page "Envoyer une note de frais"

## Scénario 7

**GIVEN** : Je suis connecté en tant qu'employé sur la page Dashboard
**WHEN** : Je clique sur le bouton en forme d'oeil sur une ligne de note de frais
**THEN** : Le justificatif de la note de frais s'affiche dans une pop-up

## Scénario 8

**GIVEN** : Je suis connecté en tant qu'employé sur la page Dashboard
**WHEN** : Je clique sur le bouton 'I/O' dans le menu vertical
**THEN** : Je suis déconnecté et renvoyé à la page login

## Scénario 9

**GIVEN** : Je suis connecté en tant qu'employé sur la page "Envoyer une note de frais"
**WHEN** : Je remplis correctement les champs suivants : Type de dépense, Nom de la dépense, Date, Montant TTC, TVA, Commentaire, Justificatif et je clique sur Envoyer
**THEN** : Ma note de frais est soumise et je suis renvoyée au Dashboard. Ma nouvelle note de frais apparait dans la liste.

## Scénario 10

**GIVEN** : Je suis connecté en tant qu'employé sur la page "Envoyer une note de frais"
**WHEN** : Je remplis correctement les champs suivants sauf la date et je clique sur Envoyer
**THEN** : Je reste sur la page "Envoyer une note de frais" et suis invité à corriger ma saisie

## Scénario 11

**GIVEN** : Je suis connecté en tant qu'employé sur la page "Envoyer une note de frais"
**WHEN** : Je remplis correctement les champs suivants sauf le montant TTC et je clique sur Envoyer
**THEN** : Je reste sur la page "Envoyer une note de frais" et suis invité à corriger ma saisie

## Scénario 12

**GIVEN** : Je suis connecté en tant qu'employé sur la page "Envoyer une note de frais"
**WHEN** : Je remplis correctement les champs suivants sauf le taux de TVA et je clique sur Envoyer
**THEN** : Je reste sur la page "Envoyer une note de frais" et suis invité à corriger ma saisie

## Scénario 13

**GIVEN** : Je suis connecté en tant qu'employé sur la page "Envoyer une note de frais"
**WHEN** : Je remplis correctement les champs suivants sauf la pièce-jointe et je clique sur Envoyer
**THEN** : Je reste sur la page "Envoyer une note de frais" et suis invité à corriger ma saisie