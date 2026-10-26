# Öndun

Létt íslenskt öndunarforrit fyrir skóladaginn, án innskráningar, auglýsinga, utanaðkomandi leturs eða gagnasöfnunar.

- Kassaöndun: 4 sekúndur inn, halda 4, út 4, halda 4. Punktur fylgir hliðum kassans réttsælis.
- Jöfn öndun: 4 sekúndur inn og 4 út. Blaðra stækkar og minnkar með önduninni.
- Lengd 1–5 mínútur; síðasta val vistast aðeins í tækinu.
- Fyrsti skjár: velja æfingu og tíma, síðan Áfram.
- Æfingaskjár (#aefing): aðeins öndunarform, stutt leiðsögn um núverandi skref og lítill Byrja-hnappur í neðra hægra horni. Eftir upphaf er Enda eini hnappurinn.
- Enginn tímamælir, talning, framvinduslá, fyrirsögn eða valmynd á æfingaskjá.
- Enda skilar á valið. Við tímamörk stöðvast æfingin með textanum „Æfingu lokið“ og nemandinn velur sjálfur hvenær hann fer til baka.
- Æfing stöðvast tímabundið þegar flipi er falinn og heldur áfram þegar komið er til baka. Bakktakki vafra fer af æfingaskjá og stöðvar tímann.
- Uppsetjanlegt PWA með staðbundnum táknum og þjónustuþræði fyrir notkun án nets eftir fyrstu vistun.
- Kerfisstilling fyrir minni hreyfingu stöðvar stækkun blöðrunnar; stutt leiðsögn um innöndun og útöndun helst sýnileg.

## Keyra staðbundið

```sh
python3 -m http.server 8000
```

Opnaðu http://localhost:8000. Engin uppsetning pakka eða bygging nauðsynleg.

```sh
npm test
```

## Hýsa á GitHub Pages

Í Settings → Pages → Build and deployment, veldu **Deploy from a branch**, grein **main**, möppu **/(root)** og Save. Vefslóðin verður https://ingimar90.github.io/ondun/ þegar Pages hefur birt síðuna. Engin GitHub Actions-vinnslurás er nauðsynleg.

Opnaðu síðuna í Chrome/Edge á Chromebook, Windows eða Android og veldu **Setja upp app**. Á iPhone/iPad: Safari → Deila → Bæta á heimaskjá. Stýrð skólatæki geta haft takmarkanir á uppsetningu. HTTPS eða localhost þarf fyrir þjónustuþráð. Offline-virkni er tilbúin þegar fyrsta opnun hefur náð að vista skrárnar.

## Viðhald

Við breytingar á skrám skal hækka CACHE-heitið í sw.js. Ný útgáfa tekur við þegar eldri opnum gluggum er lokað og appið opnað aftur. Allar slóðir eru afstæðar og virka undir /ondun/.

## Notkun með nemendum

Öndun á að vera mjúk og þægileg. Nemendur mega anda eðlilega, sleppa öndunarhléum eða hætta. Ekki þrýsta á að klára tímann; hætta við svima eða vanlíðan. Æfingin á ekki að knýja fram mjög djúpa eða hraða öndun.

Bakgrunnurinn #DFEDE8 er mildur blágrænn. Litaval er hönnunarákvörðun, ekki fullyrðing um að einn litur rói alla.
