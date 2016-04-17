#-*- coding: utf-8 -*-
#because the use of bounding box, many users appeared in turkey instead of syria
#this script is used to check if the user has appeared in turkey, syria or germany

def initial_country_dic():
    couDic = {'Turkey':False, 'Syria':False, 'Germany':False}
    return couDic
    
with open('spatial_join.csv','r') as f, open('user_check.csv','w') as fw:
    f.readline()
    user = '0'
    countrydic = {}
    fw.write('userid,turkey,syria,germany\n')
    for line in f:
        xx = line[:-1].split(',')
        if xx[0] != user:
            if user != '0':
                nl = user + ',' + str(countrydic['Turkey']) + ',' + \
                     str(countrydic['Syria']) + ',' + str(countrydic['Germany']) + '\n'
                fw.write(nl)
            user = xx[0]
            countrydic = initial_country_dic()

        if xx[-1] in countrydic:
            countrydic[xx[-1]] = True

        
            
            
