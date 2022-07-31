---
id: 366
title: 'Ahhh so this is why you get &#8220;Charging is not supported&#8221;'
date: '2010-08-09T11:10:22+01:00'
author: 'Simon Coles'
layout: post
guid: 'http://simoncoles.org/?p=366'
permalink: /2010/08/ahhh-so-this-is-why-you-get-charging-is-not-supported/
the_sidebar:
    - ''
sidebar_layout:
    - ''
colorscheme:
    - ''
lower_sidebar:
    - ''
content_sidebar:
    - ''
full_width_widget:
    - ''
hide_bottom_sidebars:
    - ''
featureboxes:
    - ''
carousel_items:
    - ''
carousel_mode:
    - ''
carousel_ngen_gallery:
    - ''
featuretitle:
    - ''
featuretext:
    - ''
featuremedia:
    - ''
categories:
    - Apple
    - iPhone
---

Seems that everything Audio has an iPod charger on it these days which is great. However every time I upgrade my iPhone/iPod Touch I find yet more of them don’t work any more, with a “Charging is not supported with this accessory”.

So [Via BoingBoing](http://www.boingboing.net/2010/08/04/reverse-engineering-2.html) I found this seriously geeky explanation of [how Apple Devices decide what charger they are connected to and what they can do with it](http://www.ladyada.net/make/mintyboost/icharge.html) quite enlightening.

Basically the charger tells the iPhone/iWhatever device what current it can draw (0.5 Amp or 1 Amp it seems) by putting a voltage on the data line, which the iPhone senses. So when older chargers don’t put this voltage on the line, that’s why you get charging not supported….