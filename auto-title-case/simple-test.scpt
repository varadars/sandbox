FasdUAS 1.101.10   ��   ��    k             l     ��  ��    - ' Function to convert text to Title Case     � 	 	 N   F u n c t i o n   t o   c o n v e r t   t e x t   t o   T i t l e   C a s e   
  
 i         I      �� ���� 0 	titlecase 	titleCase   ��  o      ���� 0 	inputtext 	inputText��  ��    k            r         I    �� ��
�� .sysoexecTEXT���     TEXT  b         b         m        �   
 e c h o    n        1    ��
�� 
strq  o    ���� 0 	inputtext 	inputText  m       �   �   |   a w k   ' { f o r ( i = 1 ; i < = N F ; i + + )   $ i = t o u p p e r ( s u b s t r ( $ i , 1 , 1 ) )   t o l o w e r ( s u b s t r ( $ i , 2 ) ) } 1 '��    o      ���� 0 
titlecased 
titleCased    ��   L     ! ! o    ���� 0 
titlecased 
titleCased��     " # " l     ��������  ��  ��   #  $ % $ l     �� & '��   &   Ask for the message text    ' � ( ( 2   A s k   f o r   t h e   m e s s a g e   t e x t %  ) * ) l     +���� + r      , - , n     	 . / . 1    	��
�� 
ttxt / l     0���� 0 I    �� 1 2
�� .sysodlogaskr        TEXT 1 m      3 3 � 4 4 F E n t e r   t h e   m e s s a g e   y o u   w a n t   t o   s e n d : 2 �� 5��
�� 
dtxt 5 m     6 6 � 7 7  ��  ��  ��   - o      ���� 0 
themessage 
theMessage��  ��   *  8 9 8 l     ��������  ��  ��   9  : ; : l     �� < =��   <   Convert to Title Case    = � > > ,   C o n v e r t   t o   T i t l e   C a s e ;  ? @ ? l    A���� A r     B C B I    �� D���� 0 	titlecase 	titleCase D  E�� E o    ���� 0 
themessage 
theMessage��  ��   C o      ���� &0 titlecasedmessage titleCasedMessage��  ��   @  F G F l     ��������  ��  ��   G  H I H l     �� J K��   J   Set the recipient    K � L L $   S e t   t h e   r e c i p i e n t I  M N M l     O���� O r      P Q P n     R S R 1    ��
�� 
ttxt S l    T���� T I   �� U V
�� .sysodlogaskr        TEXT U m     W W � X X R E n t e r   t h e   r e c i p i e n t   n a m e   o r   p h o n e   n u m b e r : V �� Y��
�� 
dtxt Y m     Z Z � [ [  ��  ��  ��   Q o      ���� 0 recipientname recipientName��  ��   N  \ ] \ l     ��������  ��  ��   ]  ^ _ ^ l     �� ` a��   `   Send the message    a � b b "   S e n d   t h e   m e s s a g e _  c d c l  ! P e���� e O   ! P f g f k   % O h h  i j i r   % 6 k l k 6  % 2 m n m 4 % )�� o
�� 
icsv o m   ' (����  n =   * 1 p q p 1   + -��
�� 
styp q m   . 0��
�� stypsims l o      ���� 0 targetservice targetService j  r s r r   7 C t u t n   7 ? v w v 4   : ?�� x
�� 
pres x o   = >���� 0 recipientname recipientName w o   7 :���� 0 targetservice targetService u o      ���� 0 thebuddy theBuddy s  y�� y I  D O�� z {
�� .ichtsendnull���     **** z o   D E���� &0 titlecasedmessage titleCasedMessage { �� |��
�� 
TO   | o   H K���� 0 thebuddy theBuddy��  ��   g m   ! " } }�                                                                                      @ alis    8  Macintosh HD               �Ԧ�BD ����Messages.app                                                   �����Ԧ�        ����  
 cu             Applications  #/:System:Applications:Messages.app/     M e s s a g e s . a p p    M a c i n t o s h   H D   System/Applications/Messages.app  / ��  ��  ��   d  ~�� ~ l     ��������  ��  ��  ��       
��  � � � � � � �����    ������������������ 0 	titlecase 	titleCase
�� .aevtoappnull  �   � ****�� 0 
themessage 
theMessage�� &0 titlecasedmessage titleCasedMessage�� 0 recipientname recipientName�� 0 targetservice targetService�� 0 thebuddy theBuddy��   � �� ���� � ����� 0 	titlecase 	titleCase�� �� ���  �  ���� 0 	inputtext 	inputText��   � ������ 0 	inputtext 	inputText�� 0 
titlecased 
titleCased �  �� ��
�� 
strq
�� .sysoexecTEXT���     TEXT�� ��,%�%j E�O� � �� ����� � ���
�� .aevtoappnull  �   � **** � k     P � �  ) � �  ? � �  M � �  c����  ��  ��   �   �  3�� 6���������� W Z�� }�� ���������������
�� 
dtxt
�� .sysodlogaskr        TEXT
�� 
ttxt�� 0 
themessage 
theMessage�� 0 	titlecase 	titleCase�� &0 titlecasedmessage titleCasedMessage�� 0 recipientname recipientName
�� 
icsv �  
�� 
styp
�� stypsims�� 0 targetservice targetService
�� 
pres�� 0 thebuddy theBuddy
�� 
TO  
�� .ichtsendnull���     ****�� Q���l �,E�O*�k+ E�O���l �,E�O� ,*�k/�[�,\Z�81E` O_ a �/E` O�a _ l U � � � � > h e l l o   t h i s   i s   m e   t e s t i n g   i t   o u t � � � � > H e l l o   T h i s   I s   M e   T e s t i n g   I t   O u t � � � �  4 1 0 7 0 7 4 9 2 3 �  � �  }�� ���
�� 
icsv � � � � H 0 8 4 F 2 8 1 D - 6 D C D - 4 6 5 3 - 9 A 7 7 - B 7 7 2 4 C 4 A 6 C 4 0
�� kfrmID   �  � �  }�� ���
�� 
pres � � � � b 0 8 4 F 2 8 1 D - 6 D C D - 4 6 5 3 - 9 A 7 7 - B 7 7 2 4 C 4 A 6 C 4 0 : + 1 4 1 0 7 0 7 4 9 2 3
�� kfrmID  ��  ascr  ��ޭ