# Generated by Django 5.0.4 on 2024-04-30 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('v4', '0003_alter_room_word'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='word',
            field=models.CharField(blank=True, default='', max_length=200, null=True),
        ),
    ]
