#-*- coding: utf-8 -*-
#cnverting time from '%a %b %d %H:%M:%S +0000 %Y' format to '%Y-%m-%d %H:%M:%S' format
#the latter format can be stored in PostgreSQL as timestamp (without time zone) format

import time

with open('spatial_join.csv','r') as fr, open('spatial_join_tfordb.csv','w') as fw:
    fr.readline()
    for line in fr:
        xx = line.split(',')
        ts = time.strftime('%Y-%m-%d %H:%M:%S', time.strptime(xx[2],'%a %b %d %H:%M:%S +0000 %Y'))
        nl = xx[0] + ',' + xx[1] + ',' + xx[2] + ',' + str(ts) + ',' + xx[3] + ',' + xx[4] + ',' + xx[5] + ',' + xx[6]
        fw.write(nl)
        
